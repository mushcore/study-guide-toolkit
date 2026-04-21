import { ReactNode } from "react";

interface ListProps<T> {
    items: T[];
    render: (item: T) => ReactNode;
}

const List = <T,>({ items, render }: ListProps<T>) => {
    return (
        <>
            {items.map((item, index) => (
                <span key={index}>{render(item)}</span>
            ))}
        </>
    );
};

export default List;
