import { updateCommercialDataOfClientApi } from '@/axios/AbstractionsApi/ApiClientB2b'
import { ClientB2B } from '@/types/AppTypes'
import { BaseKeyValue, updateCommercialDataOfClientApiData } from '@/types/requests_types'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcnuicomponents/ui/dialog"
import { Button } from '@/shadcnuicomponents/custom/button'
import { Label } from '@/shadcnuicomponents/ui/label'
import { Input } from '@/shadcnuicomponents/ui/input'
import { toast } from '@/shadcnuicomponents/ui/use-toast'
import { useTranslation } from 'react-i18next'
import { objectUpdatedSuccessfully } from '@/lib/helpers/language_validation_helper'
import i18n from '@/i18n'

function ClientCommercialData({ client }: { client: ClientB2B }) {
    const [IsDialogOpen, setIsDialogOpen] = useState(false)
    const { t } = useTranslation()
    const updateCommercialDataOfClientApiMutation = useMutation({
        mutationKey: ['updateCommercialDataOfClientApiMutation'],
        mutationFn: (data: updateCommercialDataOfClientApiData) =>
            updateCommercialDataOfClientApi(data),
        onSuccess: () => {
            setIsDialogOpen(false);
            toast({
                title: objectUpdatedSuccessfully(i18n.language, t("commercial_data")),
                className: "bg-emerald-500",
                variant: "default",
            });
        }
    })

    // initialize with a shallow copy to avoid referencing parent's objects
    const [commercialData, setCommercialData] = useState<BaseKeyValue[]>(
        (client.commercial_data || []).map(item => ({ ...item }))
    )

    // keep local state in sync if parent client changes
    useEffect(() => {
        setCommercialData((client.commercial_data || []).map(item => ({ ...item })))
    }, [client.commercial_data])

    const [formData, setFormData] = useState<BaseKeyValue>({
        key: '',
        value: '',
    })

    const [editIndex, setEditIndex] = useState<number | null>(null)

    // ADD: clone formData when pushing
    const addItem = () => {
        if (!formData.key.trim() || !formData.value.trim()) return

        setCommercialData(prev => [...prev, { ...formData }])
        setFormData({ key: '', value: '' })
    }

    // DELETE
    const deleteItem = (index: number) => {
        setCommercialData(prev => prev.filter((_, i) => i !== index))
        // if deleting the item currently being edited, reset form
        if (editIndex === index) {
            setEditIndex(null)
            setFormData({ key: '', value: '' })
        } else if (editIndex !== null && index < editIndex) {
            // if we removed an earlier element, shift editIndex
            setEditIndex(prev => (prev !== null ? prev - 1 : prev))
        }
    }

    // START EDIT: copy the item into formData (so edits don't mutate array directly)
    const startEdit = (index: number) => {
        const item = commercialData[index]
        if (!item) return
        setEditIndex(index)
        setFormData({ ...item })
    }

    // SAVE EDIT: replace element with new object (cloned)
    const saveEdit = () => {
        if (editIndex === null) return
        if (!formData.key.trim() || !formData.value.trim()) return

        setCommercialData(prev =>
            prev.map((item, i) => (i === editIndex ? { ...formData } : item))
        )

        setEditIndex(null)
        setFormData({ key: '', value: '' })
    }

    // SAVE TO API
    const handleSave = () => {
        updateCommercialDataOfClientApiMutation.mutate({
            client_b2b_id: client.id,
            data: commercialData,
        })
    }

    return (
        <Dialog open={IsDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{t("commercial_data")}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("commercial_data")}</DialogTitle>
                    <DialogDescription>
                        {t("commercial_data_description")}
                    </DialogDescription>
                </DialogHeader>

                {/* Inputs */}
                <div className="grid gap-3">
                    <Label>Key</Label>
                    <Input
                        value={formData.key}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, key: e.target.value }))
                        }
                        placeholder="Enter key"
                    />

                    <Label>Value</Label>
                    <Input
                        value={formData.value}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, value: e.target.value }))
                        }
                        placeholder="Enter value"
                    />

                    <div className="flex gap-2">
                        {editIndex === null ? (
                            <Button type="button" onClick={addItem}>
                                Add
                            </Button>
                        ) : (
                            <>
                                <Button type="button" onClick={saveEdit}>
                                    Update
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditIndex(null)
                                        setFormData({ key: '', value: '' })
                                    }}
                                >
                                    Cancel Edit
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="mt-4 space-y-2">
                    {commercialData.map((item, index) => (
                        <div
                            key={`${item.key}-${index}`}
                            className="flex justify-between items-center border p-2 rounded"
                        >
                            <span>
                                <strong>{item.key}:</strong> {item.value}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => startEdit(index)}
                                >
                                    {t("edit")}
                                </Button>
                                <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={() => deleteItem(index)}
                                >
                                    {t("delete")}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            {t("btn_cancel_txt")}
                        </Button>
                    </DialogClose>

                    <Button type="button" onClick={handleSave}>
                        {t("save_changes")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ClientCommercialData
