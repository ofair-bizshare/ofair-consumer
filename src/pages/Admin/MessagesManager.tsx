
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { fetchUserMessages, fetchAllUsers, sendUserMessage } from '@/services/admin';
import { UserMessageInterface, UserProfileInterface } from '@/types/dashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Plus, Mail, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const messageFormSchema = z.object({
  recipient: z.string().min(1, { message: 'יש לבחור נמען' }),
  subject: z.string().min(3, { message: 'נושא חייב להכיל לפחות 3 תווים' }),
  content: z.string().min(10, { message: 'תוכן ההודעה חייב להכיל לפחות 10 תווים' })
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

const MessagesManager = () => {
  const [messages, setMessages] = React.useState<UserMessageInterface[]>([]);
  const [users, setUsers] = React.useState<UserProfileInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<UserMessageInterface | null>(null);
  const { toast } = useToast();
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      content: ''
    }
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [messagesData, usersData] = await Promise.all([
        fetchUserMessages(),
        fetchAllUsers()
      ]);
      setMessages(messagesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "אירעה שגיאה בטעינת ההודעות והמשתמשים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: MessageFormValues) => {
    try {
      setSending(true);
      
      const isEmail = data.recipient.includes('@');
      const messageData = {
        recipient_id: isEmail ? undefined : data.recipient,
        recipient_email: isEmail ? data.recipient : undefined,
        subject: data.subject,
        content: data.content
      };
      
      const result = await sendUserMessage(messageData);
      
      if (result) {
        toast({
          title: "הודעה נשלחה בהצלחה",
          description: `ההודעה "${data.subject}" נשלחה בהצלחה`
        });
        
        // Reset form and close dialog
        form.reset();
        setDialogOpen(false);
        
        // Refresh the list
        fetchData();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "שגיאה בשליחת הודעה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'משתמש לא מוכר';
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול הודעות</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הודעה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>שליחת הודעה חדשה</DialogTitle>
              <DialogDescription>
                שלח הודעה למשתמש או לכתובת דוא"ל
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>נמען</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר משתמש או הזן כתובת דוא״ל" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new-email">הזן כתובת דוא״ל ידנית</SelectItem>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value === 'new-email' && (
                        <Input 
                          className="mt-2"
                          type="email" 
                          placeholder="הזן כתובת דוא״ל" 
                          onChange={e => field.onChange(e.target.value)}
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>נושא</FormLabel>
                      <FormControl>
                        <Input placeholder="נושא ההודעה" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוכן</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="תוכן ההודעה"
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="mr-2"
                    disabled={sending}
                  >
                    ביטול
                  </Button>
                  <Button type="submit" disabled={sending}>
                    {sending ? 'שולח...' : 'שלח הודעה'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>רשימת הודעות</CardTitle>
          <CardDescription>כל ההודעות שנשלחו במערכת</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">לא נמצאו הודעות</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                שלח הודעה ראשונה
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>נושא</TableHead>
                    <TableHead>שולח</TableHead>
                    <TableHead>נמען</TableHead>
                    <TableHead>תאריך</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {message.subject}
                        </div>
                      </TableCell>
                      <TableCell>{getUserName(message.sender_id)}</TableCell>
                      <TableCell>
                        {message.recipient_id 
                          ? getUserName(message.recipient_id)
                          : message.recipient_email || 'לא מוגדר'}
                      </TableCell>
                      <TableCell>{formatDate(message.created_at)}</TableCell>
                      <TableCell>
                        {message.read ? (
                          <div className="flex items-center text-green-600">
                            <Eye className="h-4 w-4 mr-1" />
                            נקראה
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            לא נקראה
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedMessage(message)}
                            >
                              צפה
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className="max-w-3xl mx-auto my-4 p-6">
                              <DrawerHeader>
                                <DrawerTitle className="text-xl font-bold">{message.subject}</DrawerTitle>
                                <DrawerDescription>
                                  <p className="text-sm text-gray-500 mt-2">
                                    מאת: {getUserName(message.sender_id)} | אל: {message.recipient_id 
                                      ? getUserName(message.recipient_id)
                                      : message.recipient_email || 'לא מוגדר'} | {formatDate(message.created_at)}
                                  </p>
                                </DrawerDescription>
                              </DrawerHeader>
                              <div className="mt-6 border-t pt-4">
                                <div className="prose max-w-none dark:prose-invert">
                                  <p>{message.content}</p>
                                </div>
                              </div>
                              <div className="mt-8 text-right">
                                <Button variant="outline">
                                  <ArrowRight className="mr-2 h-4 w-4" />
                                  השב
                                </Button>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default MessagesManager;
