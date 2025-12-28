/* import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../types/Contant";
import { ClienteSoft, Manager } from "../types/AppTypes";
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [clientsofts, setClientsofts] = useState<ClienteSoft[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const [manager, setManager] = useState<Manager>({
    id: 0,
    clientesoft_id: 0,
    nom: "",
    prenom: "",
    mail: "",
    info: "",
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Manager | null>(null);

  useEffect(() => {
    axios
      .get(URL.concat("clientesoft"))
      .then((response) => {
        setClientsofts(response.data);
      })
      .catch((error) => console.error("Erreur:", error));

    axios
      .get(URL.concat("managers"))
      .then((response) => {
        setManagers(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleOpen = () => {
    if (open) {
      resetFields();
    }
    setOpen(!open);
  };

  const handleSaveManager = () => {
    if (isEdit && id) {
      // Modification de l'élément existant
      axios.put(URL.concat("managers/" + id), manager).then((resp) => {
        if (resp.status) {
          const position = managers.findIndex((elem) => elem.id === id);
          const copieManagers = managers.filter((elem) => elem.id !== id);
          copieManagers.splice(position, 0, resp.data);
          setManagers(copieManagers);
          handleOpen();
          setIsEdit(false);
        }
      });
    } else {
      // Ajout d'un nouvel élément
      const managerCopie = manager;
      managerCopie.id = undefined!;
      axios.post(URL.concat("managers"), managerCopie).then((resp) => {
        if (resp.status) {
          const copieManagers = [...managers, resp.data];
          setManagers(copieManagers);
          resetFields();
          handleOpen();
        }
      });
    }
  };

  const handleEditManager = (id: string | number) => {
    const seleManager = managers.find((element) => element.id === id);
    if (seleManager?.id) {
      setId(seleManager.id);
      setManager(seleManager);
    }

    setIsEdit(true);
    handleOpen();
  };

  const handleDeleteManager = (id: string | number) => {
    axios.delete(URL.concat("managers/" + id)).then((resp) => {
      if (resp.status) {
        handleConfirmationOpen(null);
        const copieManagers = managers.filter((elem) => elem.id !== id);
        setManagers(copieManagers);
      }
    });
  };
  const handleConfirmationOpen = (item: Manager | null) => {
    if (item) {
      setItemToDelete(item);
    }
    setIsConfirmationOpen(!isConfirmationOpen);
  };
  const resetFields = () => {
    setId(undefined);
    setManager({
      id: 0,
      clientesoft_id: 0,
      nom: "",
      prenom: "",
      mail: "",
      info: "",
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full p-4">
        <h2 className="text-center bg-blue-gray-800 border-spacing-2 text-white m-3">
          Gestion des Managers
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
              {isEdit !== false ? "Modifier" : "Ajouter"} un manager
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
                  Nom
                </Typography>
                <Input
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={manager.nom}
                  onChange={(e) => {
                    setManager({
                      ...manager,
                      nom: e.target.value,
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
                  Prénom
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={manager.prenom}
                  onChange={(e) => {
                    setManager({ ...manager, prenom: e.target.value });
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
                  Email
                </Typography>
                <Input
                  type="email"
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={manager.mail}
                  onChange={(e) => {
                    setManager({ ...manager, mail: e.target.value });
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
                  value={manager.info}
                  onChange={(e) => {
                    setManager({ ...manager, info: e.target.value });
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
                  Client Soft
                </Typography>
                <Select
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={manager.clientesoft_id.toString()}
                  onChange={(e) => {
                    setManager({
                      ...manager,
                      clientesoft_id: parseInt(e!),
                    });
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {clientsofts.map((clientsoft) => (
                    <Option
                      key={clientsoft.id}
                      value={clientsoft.id.toString()}
                    >
                      {clientsoft.raison_social}
                    </Option>
                  ))}
                </Select>
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
                onClick={handleSaveManager}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span>Enregistrer</span>
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
                    className="font-normal leading-noneopacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Nom
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
                    Prénom
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
                    Email
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
                    Client Soft
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
              {managers.map((item, index) => {
                const isLast = index === managers.length - 1;
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
                        {item.nom}
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
                        {item.prenom}
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
                        {item.mail}
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
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {clientsofts.find(
                          (clientsoft) => clientsoft.id == item.clientesoft_id
                        )?.raison_social || "N/A"}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="green"
                        className="mr-1"
                        onClick={() => handleEditManager(item.id)}
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
          Êtes-vous sûr de vouloir supprimer le manager {itemToDelete?.nom}
          {itemToDelete?.prenom} ?
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
                handleDeleteManager(itemToDelete.id);
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

export default Managers;
 */