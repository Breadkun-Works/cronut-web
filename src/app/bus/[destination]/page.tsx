import BusPage from '../page';

export default function BusWithId({ params }: { params: { destination: string } }) {
    return <BusPage params={params} />;
}
