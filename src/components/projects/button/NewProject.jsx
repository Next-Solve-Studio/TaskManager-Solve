import CanDo from "@/components/auth/CanDo";
import { AddButton } from "@/components/ui/Buttons/Buttons";

export default function NewProject({ onCreate }) {
    return (
        <CanDo permission="canCreateProjects">
            <AddButton label="Novo Projeto" action={onCreate}/>
            
        </CanDo>
    );
}
