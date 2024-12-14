'use client';
import dynamic from 'next/dynamic';
import Loading from './loading';
import ListSkeleton from '../components/loading/ListSkeleton';
import { Skeleton } from '@mui/material';

const HomeBanner = dynamic(() => import('@/components/home/HomeBanner'), {
  loading: () => <Skeleton
    variant="rectangular"
    width={"100%"}
    height={700}
    animation="wave"
  />
});
const Statistic = dynamic(() => import('@/components/home/Statistic/Statistic'), {
  loading: () => <Skeleton
    variant="rectangular"
    height={300}
    width={"100%"}
    animation="wave"
  />
});
const PromoteSection = dynamic(
  () => import('@/components/home/PromoteSection'),
  { ssr: false, loading: () => <ListSkeleton /> }
);

const BookCategory = dynamic(
  () => import('@/components/home/Category/BookCategory'),
  { ssr: false, loading: () => <ListSkeleton /> }
);

export default function Home() {

  return (
    <div>
      <HomeBanner />
      <Statistic />
      <PromoteSection />
      <BookCategory />
    </div>
  );
}
