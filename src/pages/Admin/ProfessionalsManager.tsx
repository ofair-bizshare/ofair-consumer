
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertCircle, FileSpreadsheet, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Import our refactored components
import ProfessionalsList from '@/components/admin/professionals/ProfessionalsList';
import ProfessionalsExcelUploader from '@/components/admin/professionals/ProfessionalsExcelUploader';
import ProfessionalFormDialog from '@/components/admin/professionals/ProfessionalFormDialog';
import StorageBucketAlert from '@/components/admin/professionals/StorageBucketAlert';
import ExcelFormatGuide from '@/components/admin/professionals/ExcelFormatGuide';
import { useProfessionalsManager } from '@/hooks/useProfessionalsManager';

const ProfessionalsManager = () => {
  const {
    professionals,
    loading,
    dialogOpen,
    setDialogOpen,
    uploading,
    error,
    editingProfessional,
    activeTab,
    setActiveTab,
    bucketStatus,
    handleSubmit,
    handleImageChange,
    handleEditProfessional,
    handleDeleteProfessional,
    handleCloseDialog,
    fetchData
  } = useProfessionalsManager();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול בעלי מקצוע</h1>
        
        <div className="flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                הוסף בעל מקצוע
              </Button>
            </DialogTrigger>
            <ProfessionalFormDialog 
              editingProfessional={editingProfessional}
              uploading={uploading}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              onImageChange={handleImageChange}
            />
          </Dialog>
        </div>
      </div>
      
      <StorageBucketAlert bucketStatus={bucketStatus} />
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center">
            <Star className="ml-2 h-4 w-4" />
            רשימת בעלי מקצוע
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center">
            <FileSpreadsheet className="ml-2 h-4 w-4" />
            העלאה מ-Excel
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ProfessionalsList
            professionals={professionals}
            loading={loading}
            onEdit={handleEditProfessional}
            onDelete={handleDeleteProfessional}
            onAdd={() => setDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="upload">
          <ProfessionalsExcelUploader onUploaded={fetchData} />
          <ExcelFormatGuide />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ProfessionalsManager;
