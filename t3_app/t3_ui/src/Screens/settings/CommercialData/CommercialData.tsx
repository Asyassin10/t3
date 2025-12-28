import { getAppCommercialDataApi, setAppCommercialDataApi } from "@/axios/AbstractionsApi/ApiClientEsoft"
import i18n from "@/i18n"
import { objectUpdatedSuccessfully } from "@/lib/helpers/language_validation_helper"
import { Button } from "@/shadcnuicomponents/custom/button"
import { Input } from "@/shadcnuicomponents/ui/input"
import { Label } from "@/shadcnuicomponents/ui/label"
import { Spinner } from "@/shadcnuicomponents/ui/spinner"
import { toast } from "@/shadcnuicomponents/ui/use-toast"
import { BaseKeyValue } from "@/types/requests_types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

function CommercialData() {

    const { t } = useTranslation()

    const getAppCommercialDataQuery = useQuery({
        queryKey: ['getAppCommercialDataQuery'],
        queryFn: () => getAppCommercialDataApi(),
    })
    const queryClient = useQueryClient();
    const setAppCommercialDataApiMutation = useMutation({
        mutationKey: ['updateCommercialDataOfClientApiMutation'],
        mutationFn: (data: BaseKeyValue[]) =>
            setAppCommercialDataApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAppCommercialDataQuery'] });
            toast({
                title: objectUpdatedSuccessfully(i18n.language, t("commercial_data")),
                className: "bg-emerald-500",
                variant: "default",
            });
        }
    })
    const [commercialData, setCommercialData] = useState<BaseKeyValue[]>(
        (getAppCommercialDataQuery.data || []).map(item => ({ ...item }))
    )

    // keep local state in sync if parent client changes
    useEffect(() => {
        setCommercialData((getAppCommercialDataQuery.data || []).map(item => ({ ...item })))
    }, [getAppCommercialDataQuery.data])

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
        setAppCommercialDataApiMutation.mutate(commercialData)
    }



    if (getAppCommercialDataQuery.isLoading) {
        return <Spinner />
    }
    return (
        <div className="w-full flex flex-col flex-1 p-10">
            {/* Inputs */}
            <div className="w-full flex  pb-4 mb-4">
                <div className="w-1/2 space-y-2 px-10">
                    <Label>{t("key")}</Label>
                    <Input
                        value={formData.key}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, key: e.target.value }))
                        }
                        placeholder="Enter key"
                    />

                    <Label>{t("value")}</Label>
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
                                {t("add")}
                            </Button>
                        ) : (
                            <>
                                <Button type="button" onClick={saveEdit}>
                                    {t("update")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditIndex(null)
                                        setFormData({ key: '', value: '' })
                                    }}
                                >
                                    {t("cancel_edit")}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="w-1/2 space-y-2 px-10">
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
            </div>
            <div className="w-full p-10">
                <Button type="button" onClick={handleSave}>
                    {t("save_changes")}
                </Button>
            </div>
        </div>
    )
}

export default CommercialData