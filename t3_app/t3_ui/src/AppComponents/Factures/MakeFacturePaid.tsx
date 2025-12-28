import { MakeFacturePaidApi } from '@/axios/AbstractionsApi/ApiFacture'
import { Button } from '@/shadcnuicomponents/custom/button'
import { toast } from '@/shadcnuicomponents/ui/use-toast'
import { IFature } from '@/types/AppTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

function MakeFacturePaid({ facture }: { facture: IFature }) {
    const { t } = useTranslation()
    const queryClient = useQueryClient();

    const MakeFacturePaidApiMutation = useMutation({
        mutationKey: ["MakeFacturePaidApi"],
        mutationFn: (data: FormData) => MakeFacturePaidApi(data),
        onSuccess: () => {
            toast({
                title: t("operation_done_successfully")
            })

            queryClient.invalidateQueries({ queryKey: ["facture_query"] })
        }
    })
    const HandleMakeFacturePaidApiMutation = () => {
        const formData = new FormData();
        formData.append("facture_id", facture.id.toString());
        MakeFacturePaidApiMutation.mutate(formData);
    }
    return (
        <Button
            variant="ghost"
            onClick={HandleMakeFacturePaidApiMutation}>
            {t("make_it_paid")}
        </Button>
    )
}

export default MakeFacturePaid