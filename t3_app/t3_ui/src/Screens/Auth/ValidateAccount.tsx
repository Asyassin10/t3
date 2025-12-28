import { useParams } from 'react-router-dom';

function ValidateAccount() {
  const { token } = useParams();
  return (
    <div>
      {token}
    </div>
  )
}

export default ValidateAccount
