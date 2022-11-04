import { FormEvent, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { api } from "../lib/axios";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarsImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { useToast } from "@chakra-ui/react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');
  
  const toast = useToast()

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      setPoolTitle('');

      toast({
        title: 'Bolão criado!',
        description: "Código copiado para a área de transferência.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

      console.log('FOI')

    } catch (err) {
      console.log(err);

      toast({
        title: 'Falha ao criar o bolão.',
        description: "Ocorreu um erro ao criar o bolão, tente novamente.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 items-center h-screen gap-28">
      <main>
        <Image src={logoImg} alt="Nlw Copa"/>

        <h1 className="mt-14 text-white font-bold text-5xl leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={avatarsImg} alt=""/>

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input 
            type="text" 
            required
            placeholder="Qual nome do seu bolão?" 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm hover:bg-yellow-700"
          >
              CRIAR MEU BOLÃO
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt=""/>

            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt=""/>

            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel da nlw copa" />
    </div>
  )
}

export const getServerSideProps : GetServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: userCountResponse.data.count
    }
  }
}
