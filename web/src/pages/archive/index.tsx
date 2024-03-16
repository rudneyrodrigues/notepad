import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { Aside } from '@/components/app/Aside'
import { Header } from '@/components/app/Header'
import { withSSRAuth } from '@/utils/withSSRAuth'
import { NotesArchive } from '@/components/app/Notes/Archive'
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable'

export default function Archive() {
  return (
    <>
      <Head>
        <title>Arquivo | Notepad</title>

        <meta name="title" content="Arquivo" />
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

          <NotesArchive />
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
