/* eslint-disable no-nested-ternary */
import { useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchImages = ({ pageParam = 0 }) =>
    api.get(`/api/images?after=${pageParam}`);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchImages,
    {
      // TODO GET AND RETURN NEXT PAGE PARAM
      getNextPageParam: (lastPage, pages) => lastPage.data.after,
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    console.log(isLoading, ' ', isFetchingNextPage, data);
    const formdata = data?.pages[0].data.data.map(dt => {
      return {
        title: dt.title,
        description: dt.description,
        url: dt.url,
        ts: dt.ts,
        id: dt.id,
      };
    });
    return formdata;
  }, [data]);

  return (
    <>
      <Header />

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error />
      ) : (
        <Box maxW={1120} px={20} mx="auto" my={20}>
          <CardList cards={formattedData} />
          {
            /* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */
            hasNextPage && (
              <Button
                onClick={() => {
                  fetchNextPage();
                }}
              >
                {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </Button>
            )
          }
        </Box>
      )}
    </>
  );
}
