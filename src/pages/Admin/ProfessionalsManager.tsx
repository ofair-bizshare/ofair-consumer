
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, AlertCircle, FileSpreadsheet, Star } from 'lucide-react';
import ProfessionalsList from '@/components/admin/professionals/ProfessionalsList';
import ProfessionalsExcelUploader from '@/components/admin/professionals/ProfessionalsExcelUploader';
import StorageInitializer from '@/components/admin/storage/StorageInitializer';
import ProfessionalDialog from '@/components/admin/professionals/ProfessionalDialog';
import ExcelUploadInfo from '@/components/admin/professionals/ExcelUploadInfo';
import { useProfessionalsManager } from '@/hooks/useProfessionalsManager';

const ProfessionalsManager = () => {
  const { toast } = useToast();
  const {
    professionals,
    loading,
    dialogOpen,
    setDialogOpen,
    error,
    editingProfessional,
    activeTab,
    setActiveTab,
    bucketStatus,
    setBucketStatus,
    fetchData,
    handleSubmit,
    handleImageChange,
    handleEditProfessional,
    handleDeleteProfessional,
    handleCloseDialog,
    uploading
  } = useProfessionalsManager();

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול בעלי מקצוע</h1>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            הוסף בעל מקצוע
          </Button>
        </div>
      </div>
      
      <StorageInitializer 
        requiredBuckets={['professionals']}
        onStatusChange={(status) => {
          setBucketStatus({
            professionals: status.missingBuckets.indexOf('professionals') === -1
          });
        }}
      />
      
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
          <ExcelUploadInfo />
        </TabsContent>
      </Tabs>

      <ProfessionalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        onImageChange={handleImageChange}
        uploading={uploading}
        professional={editingProfessional}
        onClose={handleCloseDialog}
      />
    </AdminLayout>
  );
};

export default ProfessionalsManager;
