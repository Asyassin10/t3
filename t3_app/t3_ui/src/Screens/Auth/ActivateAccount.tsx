import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
interface ActivateAccountResponse {
  message: string;
}

const ActivateAccount: React.FC = () => {
  /* const navigate = useNavigate(); */
  const { token } = useParams();
  const [OK, setOK] = useState(false)

  /*   const mutation = useMutation<AxiosResponse<ActivateAccountResponse>, Error>({
      mutationKey: ["activate_key"],
      mutationFn: () => {
        return
      },
      onSuccess: (response) => {
     
      },
      onError: (error:AxiosError<{message:string}>) => {
        // Handle error appropriately, for example show a toast notification
      
      }
    }); */
  const verify = () => {
    axios.post<ActivateAccountResponse>('http://127.0.0.1:8000/api/active_account', { token: token?.split('=')[1] }).then(() => {
      setOK(true);
    }).catch(() => {
      setOK(false);

    })
  }

  useEffect(() => {

    verify();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (<>


    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white dark:bg-gray-950 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-green-500 text-white rounded-full p-3">
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold"> {OK ? " Compte activé" : " Compte non activé"}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Toutes nos félicitations! Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter et commencer à utiliser notre
            plate-forme.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            to={'/auth/signing'}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>

  </>);
}


export default ActivateAccount;
