/* import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../types/Contant";
import { Activit } from "../types/AppTypes";
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

function Activites() {
  const [activit, setActivit] = useState<Activit[]>([]);
  const [consultantsProjets, setConsultantsProjets] = useState<
    { id: number }[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const [activite, setActivite] = useState<Activit>({
    id: 0,
    consultants_projets_id: 0,
    mois: "",
    nbre_jour: 0,
    etat: "encours",
  });

  useEffect(() => {
    axios
      .get(URL.concat("consultants_projets/"))
      .then((response) => {
        setConsultantsProjets(response.data);
      })
      .catch((error) => console.error("Erreur:", error));

    axios
      .get(URL.concat("activites"))
      .then((response) => {
        setActivit(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleOpen = () => {
    if (open) {
      resetFields();
    }
    setOpen(!open);
  };

  const handleSaveActivite = () => {
    if (isEdit && id) {
      // Modification de l'élément existant
      axios.put(URL.concat("activites/" + id), activite).then((resp) => {
        if (resp.status) {
          const position = activit.findIndex((elem) => elem.id === id);
          const copieActivites = activit.filter((elem) => elem.id !== id);
          copieActivites.splice(position, 0, resp.data);
          setActivit(copieActivites);
          handleOpen();
          setIsEdit(false);
        }
      });
    } else {
      // Ajout d'un nouvel élément
      const activiteCopie = activite;
      activiteCopie.id = undefined!;
      axios.post(URL.concat("activites"), activiteCopie).then((resp) => {
        if (resp.status) {
          const copieActivites = [...activit, resp.data];
          setActivit(copieActivites);
          resetFields();
          handleOpen();
        }
      });
    }
  };

  const handleEditActivite = (id: string | number) => {
    const seleActivite = activit.find((element) => element.id === id);
    if (seleActivite?.id) {
      setId(seleActivite.id);
      setActivite(seleActivite);
    }

    setIsEdit(true);
    handleOpen();
  };

  const handleDeleteActivite = (id: string | number) => {
    axios.delete(URL.concat("activites/" + id)).then((resp) => {
      if (resp.status) {
        const copieActivites = activit.filter((elem) => elem.id !== id);
        setActivit(copieActivites);
      }
    });
  };

  const resetFields = () => {
    setId(undefined);
    setActivite({
      id: 0,
      consultants_projets_id: 0,
      mois: "",
      nbre_jour: 0,
      etat: "encours",
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full p-4">
        <h2 className="text-center bg-blue-gray-800 border-spacing-2 text-white m-3">
          Gestion des Activités
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
              {isEdit !== false ? "Modifier" : "Ajouter"} une activité
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
                  Consultant Projet
                </Typography>
                <Select
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={activite.consultants_projets_id.toString()}
                  onChange={(e) => {
                    setActivite({
                      ...activite,
                      consultants_projets_id: parseInt(e!),
                    });
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {consultantsProjets.map((item) => (
                    <Option key={item.id} value={item.id.toString()}>
                      {item.id}
                    </Option>
                  ))}
                </Select>
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
                  Mois
                </Typography>
                <Input
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={activite.mois}
                  onChange={(e) => {
                    setActivite({ ...activite, mois: e.target.value });
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
                  Nombre de jours
                </Typography>
                <Input
                  type="number"
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={activite.nbre_jour}
                  onChange={(e) => {
                    setActivite({
                      ...activite,
                      nbre_jour: parseInt(e.target.value),
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
                  État
                </Typography>
                <Select
                  size="lg"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={activite.etat}
                  onChange={(e) => {
                    const value = e as
                      | "validé"
                      | "refusé"
                      | "encours"
                      | "envoyé";
                    setActivite({ ...activite, etat: value });
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="validé">Validé</Option>
                  <Option value="refusé">Refusé</Option>
                  <Option value="encours">En cours</Option>
                  <Option value="envoyé">Envoyé</Option>
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
                onClick={handleSaveActivite}
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
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    Consultant Projet
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
                    Mois
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
                    Nombre de jours
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
                    État
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
              {activit.map((item, index) => {
                const isLast = index === activit.length - 1;
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
                        {item.consultants_projets_id}
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
                        {item.mois}
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
                        {item.nbre_jour}
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
                        {item.etat}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        variant="text"
                        color="green"
                        className="mr-1"
                        onClick={() => handleEditActivite(item.id)}
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
                        onClick={() => handleDeleteActivite(item.id)}
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
    </div>
  );
}

export default Activites;
 */