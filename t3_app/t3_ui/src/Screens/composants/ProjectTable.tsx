/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ClientB2B, Projet } from "../../types/AppTypes";
import { URL } from "../../types/Contant";
import axios from "axios";
import { Button, Typography } from "@material-tailwind/react";

interface ProjectTableProps {
  projects: Projet[]; // Spécifie que projects est un tableau d'objets Project
  handleEditProject: (id: number) => void;
  handleDeleteProject: (id: string | number) => void;
  handleConfirmationOpen: (item: Projet | null) => void;
}

function ProjectTable({
  projects,
  handleEditProject,
  handleConfirmationOpen,
}: ProjectTableProps) {
  const [clientb2bs, setSlientb2bs] = useState<ClientB2B[] | []>([]);
  const findRaisonSocialById = (id: string | number) => {
    const client = clientb2bs.find((x) => x.id == id);
    return client ? client.raison_social : "Raison sociale non trouvée";
  };
  useEffect(() => {
    axios
      .get(URL.concat("clientb2b"))
      .then((response) => {
        setSlientb2bs(response.data);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);
  return (
    <div>
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
                Libelle
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
                Durée du projet
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
                Client BtoB
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
                Information
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
          {projects.map((item, index) => {
            const isLast = index === projects.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

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
                    {item.libelle}
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
                    {item.duree > 0 ? item.duree + " Mois" : "non precisé"}
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
                    {item.clientb2b_id} -
                    {findRaisonSocialById(item.clientb2b_id)}
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
                    onClick={() => handleEditProject(item.id)}
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
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onClick={() => handleConfirmationOpen(item)}
                  >
                    
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTable;
 */