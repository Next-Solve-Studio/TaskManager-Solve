import { AddButton } from "@/components/ui/Buttons/Buttons";

export default function NewClient({ onCreate }) {
    return (
        <>
            {onCreate && (
                <AddButton label="Novo Cliente" action={onCreate}/>
            )}
        </>
    );
}
