import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { Aside } from '@/components/app/Aside'
import { Notes } from '@/components/app/Notes'
import { Header } from '@/components/app/Header'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable'

export default function Home() {
  return (
    <>
      <Head>
        <title>Minhas notas | Notepad</title>

        <meta name="title" content="Minhas notas" />
        <meta name="description" content="Descrição da página" />
      </Head>

      <main className="min-h-screen flex flex-col">
        <Header />

        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-screen-xl mx-auto"
        >
          <Aside />

          <ResizableHandle className="hidden lg:flex" />

          <Notes />
        </ResizablePanelGroup>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  }
})
