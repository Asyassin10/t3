/* import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { IProjet } from "../../types/AppTypes";
interface ConfirmProps {
  itemToDelete: Projet | null;
  isConfirmationOpen: boolean;
  handleDeleteProject: (id: string | number) => void;
  handleConfirmationOpen: (item: IProjet | null) => void;
}

export default function DelectConfirme({
  itemToDelete,
  isConfirmationOpen,
  handleConfirmationOpen,
  handleDeleteProject,
}: ConfirmProps) {
  return (
    <Dialog
      size={"xs"}
      open={isConfirmationOpen}
      handler={() => handleConfirmationOpen(null)}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Confirmation
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Êtes-vous sûr de vouloir supprimer le projet {itemToDelete?.libelle} ?
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Button
          variant="text"
          color="red"
          onClick={() => handleConfirmationOpen(null)}
          className="mr-1"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <span>Annuler</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={() => {
            if (itemToDelete && itemToDelete.id !== undefined) {
              handleDeleteProject(itemToDelete.id);
            }
          }}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <span>Confirmer</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
 */