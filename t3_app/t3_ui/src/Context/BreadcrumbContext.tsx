import { createContext, Dispatch, ReactNode, useState } from 'react'
interface Breadcrumb {
    title: string;
    spaceApp: string;
}

interface TitleContextType {
    title: Breadcrumb;
    setTitle: Dispatch<React.SetStateAction<Breadcrumb>>;
}
const InitObjectBreadcrumb = { spaceApp: "", title: "" }
const TitleContext = createContext<TitleContextType>({
    title: InitObjectBreadcrumb,
    setTitle: () => { }
});
function BreadcrumbContext({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState<Breadcrumb>(InitObjectBreadcrumb);
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    )
}

export default BreadcrumbContext
