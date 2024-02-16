
import { useEffect, useState, CSSProperties } from 'react'
import './styles.scss'
import ClipLoader from 'react-spinners/ClipLoader';

const override: CSSProperties = {
    display: "block",
    borderColor: "red",
    position: "fixed",
    top: "47%",
    left: "47%"
};

export default function LoadMore({ url, size = 20, limit = 100 }: { url: string, size?: number, limit?: number }) {

    // fetch data on first load with size
    // display data
    // handle click on Load more button

    const [items, setItems] = useState<{ id: number, author: string, download_url: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(-1);
    const [error, setError] = useState<string | null>(null);

    async function loadNextData() {

        if (items.length >= limit)
            return;

        setError(null);
        setLoading(true);

        try {
            const nextPage = currentPage + 1;
            const response = await fetch(`${url}?page=${nextPage}&limit=${size}`);
            const data = await response.json();
            if (data)
                setItems([...items, ...data]);

            setCurrentPage(nextPage);

        } catch (ex) {
            if (ex instanceof Error) setError(ex.message);
        }

        setLoading(false);
    }

    useEffect(() => {

        if (url !== '') {
            setCurrentPage(-1);
            loadNextData();
        }
    }, [url]);



    if (error !== null)
        return <div>Error {error}</div>


    return (
        <>
            <ClipLoader color="red" loading={loading} size={100} cssOverride={override} />

            {items.length == 0 && <div>No data</div>}

            <div className='items'>
                {
                    items && items.length > 0 && items.map((item, index) => {
                        return (
                            <div key={index} className='item'>
                                <div className='item-image-wrapper'>
                                    <img src={item.download_url} className="item-image" />
                                </div>
                                <div className='item-title'>{item.author}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='load-next-button-wrapper'>
                <button onClick={loadNextData}>Load Next Data</button> <span className='loaded-info'>Loaded {(currentPage + 1) * size} out of {limit}</span>
            </div>
        </>
    )
}