import PageTemplate, { PageTemplateProps } from 'templates/Pages'
import client from 'graphql/client'
import { GET_PAGES, GET_PAGE_BY_SLUG } from 'graphql/queries'
import { useRouter } from 'next/dist/client/router'
import { GetStaticProps } from 'next'
import { GetPagesQuery, GetPageBySlugQuery } from 'graphql/generated/graphql'

export default function Page({ heading, body }: PageTemplateProps) {
  const router = useRouter()

  // retorna um loading, qualquer coisa enquanto tá sendo criado
  if (router.isFallback) return null

  return <PageTemplate heading={heading} body={body} />
}

// getStaticPaths => Serve para gerar as URLs em build time {/about, /trips/petrópolis}
// getStaticProps => Serve para buscar dados da página {props = heading, body, ...} - build time => estático
// getServerSideProps => Serve para buscar dados da página {props = heading, body, ...} - runtime => toda requisição (bundle fica no server)
/* getInitialProps => Serve para buscar dados da página {props = heading, body, ...} - runtime => toda requisição (bundle também vem para o
client) */

export async function getStaticPaths() {
  const { pages } = await client.request<GetPagesQuery>(GET_PAGES, { first: 3 })

  const paths = pages.map(({ slug }) => ({
    params: { slug }
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { page } = await client.request<GetPageBySlugQuery>(GET_PAGE_BY_SLUG, {
    slug: `${params.slug}`
  })

  if (!page) return { notFound: true }

  return {
    props: {
      heading: page.heading,
      body: page.body.html
    }
  }
}
// export const getStaticProps = async () => {

//   console.log(pages);

//   return {
//     props: {}
//   }
// }
