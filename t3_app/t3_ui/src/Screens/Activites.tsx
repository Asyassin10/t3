import { Button } from "@/shadcnuicomponents/custom/button";
import { Activity } from "@/types/AppTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcnuicomponents/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcnuicomponents/ui/select";
import { useToast } from "@/shadcnuicomponents/ui/use-toast";
import { Label } from "@/shadcnuicomponents/ui/label";
import { useTranslation } from "react-i18next";
import { Trash } from "lucide-react";
import CreateActivity from "@/AppComponents/Activity/CreateActivity";
import UpdateActivity from "@/AppComponents/Activity/UpdateActivity";
import { deleteActivityApi, getActivities, getProjectsNonPaginated } from "@/axios/AbstractionsApi/ApiProjet";


function Activites() {
  const [projetFiltre, setProjetFiltre] = useState<number>();
  const [filteredActivites, setFilteredActivites] = useState<Activity[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation()




  const activites_query = useQuery({
    queryKey: ["activites_query"],
    queryFn: () => getActivities()
  });

  const projects_query = useQuery({
    queryKey: ["projects_query_non_paginated"],
    queryFn: () => getProjectsNonPaginated()
  });





  useEffect(() => {
    if (activites_query.isSuccess) {
      if (projetFiltre) {
        const filtered = activites_query.data.filter(
          (activite) => activite.project_id === projetFiltre
        );
        setFilteredActivites(filtered);
      } else {
        setFilteredActivites(activites_query.data);
      }
    }
  }, [activites_query.data, activites_query.isSuccess, projetFiltre]);

  const deleteActivityApiMutation = useMutation({
    mutationKey: ["deleteActivityApi"],
    mutationFn: (id: number) => deleteActivityApi(id),
    onSuccess: () => {
      toast({
        title: t("activity_deleted_successfully"),
        className: "bg-emerald-500",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["activites_query"],
      });
    },
    onError: () => {
      toast({
        title: t("general_error"),
        className: "bg-red-500",
        variant: "default",
      });

    }
  })
  function DeleteActivityAction(activity: Activity) {
    deleteActivityApiMutation.mutate(activity.id)
  }
  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between px-10 my-2">
        <div className="flex items-center">
          <Label className="m-4">
            {t("activities_list")} ({filteredActivites.length})
          </Label>
          <CreateActivity projects_query={projects_query.data || []} />
        </div>
        <div className="flex justify-start items-center">
          <div className="mr-3">{t("filter_by_project")} </div>
          <Select
            value={projetFiltre?.toString()}
            onValueChange={(e) => {
              setProjetFiltre(parseInt(e));
            }}
          >
            <SelectTrigger className="w-5/5">
              <SelectValue placeholder="Select  project" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {projects_query.data?.map((project, index) => (
                  <SelectItem value={project.id.toString()} key={index}>
                    {project.project_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={() => {
            setProjetFiltre(undefined);
          }} className="mx-4">
            {t("btntxtresetfilter")}
          </Button>
        </div>
      </div>
      <hr />
      <div className="flex flex-wrap">
        {filteredActivites.map((activite, index) => (
          <Card key={index} className="w-1/4 m-4 ">
            <div className="m-1">
              <CardHeader className="p-2 m-0 h-auto">
                <CardTitle>{t("activity")} : {activite.activity_name}</CardTitle>
                <CardDescription className="">
                  <p>
                    <strong>{t("project")}:</strong> {activite.project?.project_name ?? "N/A"}
                  </p>
                  <p>
                    <strong>{t("user")}:</strong> {activite.user?.name ?? "N/A"}
                  </p>
                </CardDescription>

              </CardHeader>

              <CardFooter className="flex justify-end p-0 m-0 h-auto">


                <UpdateActivity projects_query={projects_query.data || []} activity={activite} />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => {
                    DeleteActivityAction(activite);
                  }}
                  className="text-green-400"
                >
                  <Trash className="text-red-400 w-4 h-4" />
                </Button>

              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Activites;
