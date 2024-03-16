import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { Aside } from '@/components/app/Aside'
import { Header } from '@/components/app/Header'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { NotesTrash } from '@/components/app/Notes/Trash'
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable'

export default function Trash() {
  return (
    <>
      <Head>
        <title>Lixeira | Notepad</title>

        <meta name="title" content="Lixeira" />
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

          <NotesTrash />
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
