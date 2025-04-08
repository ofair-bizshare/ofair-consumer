
import React from 'react';
import { ProfessionalInterface } from '@/services/professionals/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfessionalsListProps {
  professionals: ProfessionalInterface[];
  loading: boolean;
  onEdit: (professional: ProfessionalInterface) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ProfessionalsList: React.FC<ProfessionalsListProps> = ({
  professionals,
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>רשימת בעלי מקצוע</CardTitle>
        <CardDescription>ניהול בעלי המקצוע במערכת</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">לא נמצאו בעלי מקצוע</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onAdd}
            >
              הוסף בעל מקצוע ראשון
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>מקצוע</TableHead>
                <TableHead>מיקום</TableHead>
                <TableHead>דירוג</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell className="font-medium">{professional.name}</TableCell>
                  <TableCell>{professional.profession}</TableCell>
                  <TableCell>{professional.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 ml-1" />
                      <span>{professional.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{professional.phoneNumber || professional.phone_number || 'אין מספר'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEdit(professional)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onDelete(professional.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalsList;
