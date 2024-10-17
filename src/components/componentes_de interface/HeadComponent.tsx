import { Head } from "next/document";

export interface HeadComponentProps {
    titulo: string
    metaName?: string
    metaContent?: string
}

export default function HeadComponent(props : HeadComponentProps){
    return (
        <Head>
            <title>{props.titulo}</title>
            <meta name={props.metaName} content={props.metaContent}/>
        </Head>
    )
}
