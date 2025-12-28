"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlus, faTrash, faCalendarAlt } from "@fortawesome/free-solid-svg-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/shadcnuicomponents/ui/dialog"
import { Button } from "@/shadcnuicomponents/ui/button"
import { Input } from "@/shadcnuicomponents/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcnuicomponents/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcnuicomponents/ui/table"
import { Badge } from "@/shadcnuicomponents/ui/badge"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcnuicomponents/ui/alert-dialog"
import { useTranslation } from "react-i18next"

// Constants
const URL = "http://localhost:3000/"

// Types
interface JourFerie {
  id: number
  libelle: string
  date: string // Format YYYY-MM-DD
}

function JourFeries() {
  const [jourFeries, setJourFeries] = useState<JourFerie[]>([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [id, setId] = useState<number | undefined>(undefined)
  const [jourFerie, setJourFerie] = useState<JourFerie>({
    id: 0,
    libelle: "",
    date: "",
  })
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<JourFerie | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(URL.concat("joursferies"))
      .then((response) => {
        setJourFeries(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Erreur:", error)
        setIsLoading(false)
      })
  }, [])

  const handleOpen = () => {
    if (open) {
      resetFields()
    }
    setOpen(!open)
  }

  const handleSaveJourFerie = () => {
    // Validation
    if (!jourFerie.libelle.trim() || !jourFerie.date) {
      return
    }

    if (isEdit && id) {
      axios.put(URL.concat("joursferies/" + id), jourFerie).then((resp) => {
        if (resp.status) {
          const position = jourFeries.findIndex((elem) => elem.id === id)
          const copieJourFeries = jourFeries.filter((elem) => elem.id !== id)
          copieJourFeries.splice(position, 0, resp.data)
          setJourFeries(copieJourFeries)
          handleOpen()
          setIsEdit(false)
        }
      })
    } else {
      const jourFerieCopie = jourFerie
      jourFerieCopie.id = undefined!
      axios.post(URL.concat("joursferies"), jourFerieCopie).then((resp) => {
        if (resp.status) {
          const copieJourFeries = [...jourFeries, resp.data]
          setJourFeries(copieJourFeries)
          resetFields()
          handleOpen()
        }
      })
    }
  }

  const handleEditJourFerie = (id: string | number) => {
    const seleJourFerie = jourFeries.find((element) => element.id === id)
    if (seleJourFerie?.id) {
      setId(seleJourFerie.id)
      setJourFerie(seleJourFerie)
    }

    setIsEdit(true)
    handleOpen()
  }

  const handleDeleteJourFerie = (id: string | number) => {
    axios.delete(URL.concat("joursferies/" + id)).then((resp) => {
      if (resp.status) {
        handleConfirmationOpen(null)
        const copieJourFeries = jourFeries.filter((elem) => elem.id !== id)
        setJourFeries(copieJourFeries)
      }
    })
  }

  const handleConfirmationOpen = (item: JourFerie | null) => {
    if (item) {
      setItemToDelete(item)
    }
    setIsConfirmationOpen(!isConfirmationOpen)
  }

  const resetFields = () => {
    setId(undefined)
    setJourFerie({
      id: 0,
      libelle: "",
      date: "",
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: fr })
    } catch (error) {
      return dateString
    }
  }
  const { t } = useTranslation()
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5" />
              <CardTitle>Gestion des Jours Fériés</CardTitle>
            </div>
            <Button
              onClick={handleOpen}
              variant="secondary"
              className="hover:bg-white hover:text-slate-800 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
          <CardDescription className="text-slate-200 mt-2">Gérez les jours fériés de votre calendrier</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
            </div>
          ) : jourFeries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">Aucun jour férié</h3>
              <p className="text-slate-500 mt-2 max-w-md">
                Vous n'avez pas encore ajouté de jours fériés. Cliquez sur le bouton "Ajouter" pour commencer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jourFeries.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.libelle}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 hover:bg-slate-100">
                          {formatDate(item.date)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditJourFerie(item.id)}
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-3.5 w-3.5" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfirmationOpen(item)}
                            className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding/editing */}
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={isEdit ? faEdit : faPlus} className="h-5 w-5 text-slate-700" />
              {isEdit ? "Modifier" : "Ajouter"} un jour férié
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modifiez les informations du jour férié sélectionné."
                : "Ajoutez un nouveau jour férié au calendrier."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="libelle" className="text-sm font-medium text-slate-700">
                Libellé
              </label>
              <Input
                id="libelle"
                value={jourFerie.libelle}
                onChange={(e) => setJourFerie({ ...jourFerie, libelle: e.target.value })}
                placeholder="Ex: Jour de l'An"
                className="focus-visible:ring-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-slate-700">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={jourFerie.date}
                onChange={(e) => setJourFerie({ ...jourFerie, date: e.target.value })}
                className="focus-visible:ring-slate-700"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={handleOpen}>
                {t("btn_cancel_txt")}
              </Button>
              <Button
                onClick={handleSaveJourFerie}
                className="bg-slate-800 hover:bg-slate-700"
                disabled={!jourFerie.libelle.trim() || !jourFerie.date}
              >
                {isEdit ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for deletion */}
      <AlertDialog open={isConfirmationOpen} onOpenChange={() => handleConfirmationOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le jour férié{" "}
              <span className="font-medium text-slate-900">{itemToDelete?.libelle}</span> ?
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("btn_cancel_txt")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (itemToDelete && itemToDelete.id !== undefined) {
                  handleDeleteJourFerie(itemToDelete.id)
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default JourFeries
