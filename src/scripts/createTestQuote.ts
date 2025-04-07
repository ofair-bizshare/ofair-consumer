
import { supabase } from '@/integrations/supabase/client';

/**
 * Adds a test quote for user@test.com
 * To execute in the browser console, run:
 * import { createTestQuote } from './scripts/createTestQuote.ts'; 
 * createTestQuote();
 */
export const createTestQuote = async () => {
  try {
    // First, find the user@test.com user
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: 'user@test.com',
      password: 'password123'
    });
    
    if (userError) {
      console.error('Error finding test user:', userError);
      return;
    }
    
    const userId = userData.user?.id;
    if (!userId) {
      console.error('Test user not found');
      return;
    }
    
    // Check if there's an active request already
    const { data: requests, error: requestError } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);
      
    if (requestError) {
      console.error('Error finding active requests:', requestError);
      return;
    }
    
    let requestId;
    
    // If there's no active request, create one
    if (!requests || requests.length === 0) {
      const { data: newRequest, error: createError } = await supabase
        .from('requests')
        .insert({
          user_id: userId,
          title: 'תיקון צנרת במטבח',
          description: 'ברז דולף במטבח, יש צורך בהחלפה של הברז ותיקון דליפה בצנרת',
          location: 'תל אביב',
          status: 'active'
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating test request:', createError);
        return;
      }
      
      requestId = newRequest.id;
    } else {
      requestId = requests[0].id;
    }
    
    // Find a professional to assign the quote to
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .limit(1);
      
    if (profError || !professionals || professionals.length === 0) {
      console.error('Error finding professional:', profError);
      return;
    }
    
    const professional = professionals[0];
    
    // Check if there's already a quote for this request and professional
    const { data: existingQuotes, error: quoteCheckError } = await supabase
      .from('quotes')
      .select('*')
      .eq('request_id', requestId)
      .eq('professional_id', professional.id);
      
    if (quoteCheckError) {
      console.error('Error checking existing quotes:', quoteCheckError);
      return;
    }
    
    if (existingQuotes && existingQuotes.length > 0) {
      console.log('Quote already exists for this request and professional');
      return;
    }
    
    // Create a test quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        request_id: requestId,
        professional_id: professional.id,
        price: '350 ₪',
        estimated_time: '1-2 שעות',
        description: 'אחליף את הברז ואתקן את הדליפה, כולל חלקי חילוף',
        status: 'pending'
      })
      .select();
      
    if (quoteError) {
      console.error('Error creating test quote:', quoteError);
      return;
    }
    
    console.log('Test quote created successfully:', quote);
    return quote;
  } catch (error) {
    console.error('Error in creating test quote:', error);
  }
};
