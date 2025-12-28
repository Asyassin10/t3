/* import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../types/Contant";
import { ClienteSoft } from "../types/AppTypes";
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function ClientSofts() {
  const [clientsofts, setClientsofts] = useState<ClienteSoft[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const [clientsoft, setClientsoft] = useState<ClienteSoft>({
    id: 0,
    raison_social: "",
    info: "",
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClienteSoft | null>(null);

  useEffect(() => {
    axios
      .get(URL.concat("clientesoft"))
      .then((response) => {
        setClientsofts(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleOpen = () => {
    if (open) {
      resetFields();
    }
    setOpen(!open);
  };

  const handleSaveClientSoft = () => {
    if (isEdit && id) {
      // Modification de l'élément existant
      axios.put(URL.concat("clientesoft/" + id), clientsoft).then((resp) => {
        if (resp.status) {
          const position = clientsofts.findIndex((elem) => elem.id === id);
          const copieClientSofts = clientsofts.filter((elem) => elem.id !== id);
          copieClientSofts.splice(position, 0, resp.data);
          setClientsofts(copieClientSofts);
          handleOpen();
          setIsEdit(false);
        }
      });
    } else {
      // Ajout d'un nouvel élément
      const clientsoftCopie = clientsoft;
      clientsoftCopie.id = undefined!;
      axios.post(URL.concat("clientesoft"), clientsoftCopie).then((resp) => {
        if (resp.status) {
          const copieClientSofts = [...clientsofts, resp.data];
          setClientsofts(copieClientSofts);
          resetFields();
          handleOpen();
        }
      });
    }
  };

  const handleEditClientSoft = (id: string | number) => {
    const seleClientSoft = clientsofts.find((element) => element.id === id);
    if (seleClientSoft?.id) {
      setId(seleClientSoft.id);
      setClientsoft(seleClientSoft);
    }

    setIsEdit(true);
    handleOpen();
  };

  const handleDeleteClientSoft = (id: string | number) => {
    axios.delete(URL.concat("clientesoft/" + id)).then((resp) => {
      if (resp.status) {
        handleConfirmationOpen(null);
        const copieClientSofts = clientsofts.filter((elem) => elem.id !== id);
        setClientsofts(copieClientSofts);
      }
    });
  };
  const handleConfirmationOpen = (item: ClienteSoft | null) => {
    if (item) {
      setItemToDelete(item);
    }
    setIsConfirmationOpen(!isConfirmationOpen);
  };
  const resetFields = () => {
    setId(undefined);
    setClientsoft({
      id: 0,
      raison_social: "",
      info: "",
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full p-4">
        <h2 className="text-center bg-blue-gray-800 border-spacing-2 text-white m-3">
          Gestion du Client Soft
        </h2>
        <Button
          placeholder={undefined}
          onClick={handleOpen}
          variant="gradient"
          className="m-2"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <Dialog
          open={open}
          handler={handleOpen}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <form className="mb-2">
            <DialogHeader
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {isEdit !== false ? "Modifier" : "Ajouter"} un client Soft
            </DialogHeader>
            <DialogBody
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="mb-1 flex flex-col gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="-mb-3"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Raison Sociale
                </Typography>
                <Input
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={clientsoft.raison_social}
                  onChange={(e) => {
                    setClientsoft({
                      ...clientsoft,
                      raison_social: e.target.value,
                    });
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
              <div className="mb-1 flex flex-col gap-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="-mb-3"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Info
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={clientsoft.info}
                  onChange={(e) => {
                    setClientsoft({ ...clientsoft, info: e.target.value });
                  }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </DialogBody>
            <DialogFooter
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Annuler</span>
              </Button>
              <Button
                variant="text"
                color="green"
                className="mr-1"
                onClick={handleSaveClientSoft}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
        <Card
          className="h-full w-full overflow-scroll"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    ID
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Raison Sociale
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Info
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {clientsofts.map((item, index) => {
                const isLast = index === clientsofts.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {item.id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {item.raison_social}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {item.info}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="green"
                        className="mr-1"
                        onClick={() => handleEditClientSoft(item.id)}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button
                        variant="text"
                        color="red"
                        className="mr-1"
                        onClick={() => handleConfirmationOpen(item)}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
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
          Êtes-vous sûr de vouloir supprimer le client
          {itemToDelete?.raison_social} ?
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
                handleDeleteClientSoft(itemToDelete.id);
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
    </div>
  );
}

export default ClientSofts;
 */