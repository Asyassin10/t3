import { SearchGlobalApi } from "@/axios/AbstractionsApi/ApiUser";
import { Button } from "@/shadcnuicomponents/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shadcnuicomponents/ui/input";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/shadcnuicomponents/ui/item";
import { getStatusLabel } from "@/lib/helpers/general_helper";
import { Spinner } from "@/shadcnuicomponents/ui/spinner";

type possibleTabs =
  | "search_activities"
  | "search_projects"
  | "search_clients"
  | "search_managers"
  | "search_absences"
  | "search_consultants";

interface Tab {
  id: possibleTabs;
  label: string;
}
function GlobalSearch() {
  const { t } = useTranslation();
  const tabs: Tab[] = [
    { id: "search_activities", label: t("search_activities") },
    { id: "search_projects", label: t("search_projects") },
    { id: "search_clients", label: t("search_clients") },
    { id: "search_managers", label: t("search_managers") },
    { id: "search_absences", label: t("search_absences") },
    { id: "search_consultants", label: t("search_consultants") },
  ];
  const [open, setOpen] = useState(false);
  const [SearchValue, setSearchValue] = useState("");
  const SearchGlobalApiQuery = useQuery({
    queryKey: ["SearchGlobalApi", SearchValue],
    queryFn: () => SearchGlobalApi(SearchValue),
    enabled: SearchValue.trim() !== "",
  });
  const [activeTab, setActiveTab] = useState<possibleTabs>("search_activities");
  const users = SearchGlobalApiQuery.data?.users;
  const isGroupedUsers =
    users && !Array.isArray(users) && "Consultant" in users;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("global_search")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>{t("global_search")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Input
              value={SearchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="..."
            />
          </div>

          <div className="w-full flex flex-col">
            <div className="flex border-b border-gray-200 w-1/2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 py-2 px-4 text-center font-medium transition-colors
                        ${activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-b-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="w-full">
              {SearchGlobalApiQuery.isFetching && (
                <div className="bg-gray-100 py-3 flex justify-center items-center border-dashed border-black mt-6 rounded-lg">
                  <Spinner />
                </div>
              )}

              {activeTab == "search_activities" &&
                SearchGlobalApiQuery.data?.activities && (
                  <>
                    {SearchGlobalApiQuery.data?.activities?.length == 0 && (
                      <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                        {t("no_data_found")}
                      </p>
                    )}
                    {SearchGlobalApiQuery.data?.activities.map((act) => (
                      <Item
                        className="bg-background hover:bg-gray-50 my-4"
                        variant="outline"
                      >
                        <ItemContent>
                          <ItemTitle>{act.activity_name}</ItemTitle>
                        </ItemContent>
                      </Item>
                    ))}
                  </>
                )}
              {activeTab == "search_absences" &&
                SearchGlobalApiQuery.data?.absences && (
                  <>
                    {SearchGlobalApiQuery.data?.absences?.length == 0 && (
                      <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                        {t("no_data_found")}
                      </p>
                    )}
                    {SearchGlobalApiQuery.data?.absences.map((abs) => (
                      <Item
                        className="bg-background hover:bg-gray-50 my-4"
                        variant="outline"
                      >
                        <ItemContent>
                          <ItemTitle>{abs.reason}</ItemTitle>
                          <ItemDescription>
                            {getStatusLabel(abs.status)}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </>
                )}
              {activeTab == "search_projects" &&
                SearchGlobalApiQuery.data?.projects && (
                  <>
                    {SearchGlobalApiQuery.data?.projects?.length == 0 && (
                      <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                        {t("no_data_found")}
                      </p>
                    )}
                    {SearchGlobalApiQuery.data?.projects.map((projet) => (
                      <Item
                        className="bg-background hover:bg-gray-50 my-4"
                        variant="outline"
                      >
                        <ItemContent>
                          <ItemTitle>{projet.project_name}</ItemTitle>
                          <ItemDescription>
                            {t("dure")}:   {projet.dure}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </>
                )}
              {activeTab == "search_clients" &&
                SearchGlobalApiQuery.data?.clients && (
                  <>
                    {SearchGlobalApiQuery.data?.clients?.length == 0 && (
                      <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                        {t("no_data_found")}
                      </p>
                    )}
                    {SearchGlobalApiQuery.data?.clients.map((client) => (
                      <Item
                        className="bg-background hover:bg-gray-50 my-4"
                        variant="outline"
                      >
                        <ItemContent>
                          <ItemTitle>{client.client_b2b_name}</ItemTitle>
                        </ItemContent>
                      </Item>
                    ))}
                  </>
                )}

              {activeTab === "search_consultants" && isGroupedUsers && (
                <>
                  {users.Consultant?.length === 0 && (
                    <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                      {t("no_data_found")}
                    </p>
                  )}

                  {users.Consultant?.map((con) => (
                    <Item
                      key={con.id}
                      className="bg-background hover:bg-gray-50 my-4"
                      variant="outline"
                    >
                      <ItemContent>
                        <ItemTitle>{con.name}</ItemTitle>
                        <ItemDescription>{con.email}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </>
              )}
              {activeTab === "search_managers" && !isGroupedUsers && (
                <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                  {t("no_data_found")}
                </p>
              )}
              {activeTab === "search_consultants" && !isGroupedUsers && (
                <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                  {t("no_data_found")}
                </p>
              )}
              {activeTab === "search_managers" && isGroupedUsers && (
                <>
                  {users.Manager?.length === 0 && (
                    <p className="bg-gray-100 py-3 text-center border-dashed border-black mt-6 rounded-lg">
                      {t("no_data_found")}
                    </p>
                  )}

                  {users.Manager?.map((man) => (
                    <Item
                      key={man.id}
                      className="bg-background hover:bg-gray-50 my-4"
                      variant="outline"
                    >
                      <ItemContent>
                        <ItemTitle>{man.name}</ItemTitle>
                        <ItemDescription>{man.email}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </>
              )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
}
export default GlobalSearch;
