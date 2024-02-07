import { Main } from "@/components"
import Head from "next/head"

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <Main withPadding={true}>
        <h1>404 - Page Not Found</h1>
      </Main>
    </>
  )
}