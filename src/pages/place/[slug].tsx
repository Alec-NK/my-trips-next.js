import PlacesTemplate, { PlacesTemplateProps } from 'templates/Places'
import client from 'graphql/client'
import { GET_PLACES, GET_PLACE_BY_SLUG } from 'graphql/queries'
import { useRouter } from 'next/dist/client/router'
import { GetStaticProps } from 'next'
import { GetPlacesQuery, GetPlaceBySlugQuery } from 'graphql/generated/graphql'

export default function Place({ place }: PlacesTemplateProps) {
  const router = useRouter()

  // retorna um loading, qualquer coisa enquanto tá sendo criado
  if (router.isFallback) return null

  return <PlacesTemplate place={place} />
}

// getStaticPaths => Serve para gerar as URLs em build time {/about, /trips/petrópolis}
// getStaticProps => Serve para buscar dados da página {props = heading, body, ...} - build time => estático
// getServerSideProps => Serve para buscar dados da página {props = heading, body, ...} - runtime => toda requisição (bundle fica no server)
/* getInitialProps => Serve para buscar dados da página {props = heading, body, ...} - runtime => toda requisição (bundle também vem para o
client) */

export async function getStaticPaths() {
  const { places } = await client.request<GetPlacesQuery>(GET_PLACES, {
    first: 3
  })

  const paths = places.map(({ slug }) => ({
    params: { slug }
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { place } = await client.request<GetPlaceBySlugQuery>(
    GET_PLACE_BY_SLUG,
    {
      slug: `${params.slug}`
    }
  )

  if (!place) return { notFound: true }

  return {
    props: {
      place
    }
  }
}
// export const getStaticProps = async () => {

//   console.log(pages);

//   return {
//     props: {}
//   }
// }
