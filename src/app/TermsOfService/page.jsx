export const metadata = {
    title: "Termos de Uso | Task Manager Solve",
    description: "Condições de uso da plataforma Task Manager Solve.",
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-bg-main text-text-primary">
            <div className="max-w-3xl mx-auto px-6 py-14">
                <a href="/" className="text-sm text-brand-500 hover:underline">
                    ← Voltar
                </a>

                <h1 className="text-3xl font-bold mt-4 mb-2">Termos de Uso</h1>
                <p className="text-sm text-text-muted mb-10">Última atualização: 25 de agosto de 2026</p>

                <div className="space-y-8 text-text-secondary leading-relaxed [&_h2]:text-text-primary [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                    <section>
                        <p>
                            Estes Termos de Uso regulam o acesso e a utilização do <strong>Task Manager Solve</strong>,
                            plataforma de gestão de tarefas, projetos e agenda de equipes, operada por [Razão Social]
                            Ltda., CNPJ nº [00.000.000/0000-00] ("nós"). Ao criar uma conta, você concorda com estes
                            termos.
                        </p>
                    </section>

                    <section>
                        <h2>1. Descrição do serviço</h2>
                        <p>
                            O Task Manager Solve é um sistema de gestão empresarial que permite organizar projetos,
                            tarefas, clientes e a agenda da equipe, incluindo a criação de reuniões com integração
                            opcional ao Google Calendar e Google Meet.
                        </p>
                    </section>

                    <section>
                        <h2>2. Cadastro e conta</h2>
                        <p>
                            Você é responsável por manter a confidencialidade das suas credenciais de acesso e por
                            todas as atividades realizadas na sua conta. O acesso de cada usuário dentro de uma
                            empresa é controlado pelo administrador da conta, conforme o perfil de permissões
                            atribuído.
                        </p>
                    </section>

                    <section>
                        <h2>3. Planos e pagamento</h2>
                        <p>
                            O uso da plataforma pode estar sujeito a planos pagos, cobrados de forma recorrente
                            conforme a modalidade contratada. O não pagamento pode resultar na suspensão ou
                            cancelamento do acesso à conta, conforme descrito nas condições comerciais vigentes no
                            momento da contratação.
                        </p>
                    </section>

                    <section>
                        <h2>4. Integrações de terceiros</h2>
                        <p>
                            Ao conectar sua conta do Google, você autoriza o Task Manager Solve a criar, atualizar e
                            cancelar eventos no seu Google Calendar em seu nome, exclusivamente para as reuniões
                            criadas dentro da plataforma. Essa integração é opcional e pode ser desativada a qualquer
                            momento. Não nos responsabilizamos por instabilidades ou alterações nos serviços do
                            Google que estejam fora do nosso controle.
                        </p>
                    </section>

                    <section>
                        <h2>5. Uso aceitável</h2>
                        <p>Você concorda em não utilizar a plataforma para:</p>
                        <ul>
                            <li>Praticar atividades ilegais ou que violem direitos de terceiros;</li>
                            <li>Tentar acessar dados de outras empresas cadastradas na plataforma;</li>
                            <li>Interferir na segurança ou no funcionamento normal do sistema.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Propriedade intelectual</h2>
                        <p>
                            O software, a marca e o layout do Task Manager Solve são de propriedade de [Razão Social]
                            Ltda. Os dados que você insere na plataforma (tarefas, projetos, clientes) continuam de
                            sua titularidade.
                        </p>
                    </section>

                    <section>
                        <h2>7. Limitação de responsabilidade</h2>
                        <p>
                            A plataforma é fornecida "como está". Envidamos esforços para manter a disponibilidade e
                            a integridade dos dados, mas não garantimos operação ininterrupta e não nos
                            responsabilizamos por perdas decorrentes de uso indevido, falhas de conectividade ou de
                            serviços de terceiros integrados (como o Google Calendar).
                        </p>
                    </section>

                    <section>
                        <h2>8. Cancelamento e rescisão</h2>
                        <p>
                            Você pode cancelar sua conta a qualquer momento. Reservamo-nos o direito de suspender
                            contas que violem estes termos ou que apresentem inadimplência não regularizada.
                        </p>
                    </section>

                    <section>
                        <h2>9. Alterações nestes termos</h2>
                        <p>
                            Podemos atualizar estes termos periodicamente. O uso continuado da plataforma após uma
                            atualização representa a aceitação das novas condições.
                        </p>
                    </section>

                    <section>
                        <h2>10. Legislação aplicável</h2>
                        <p>
                            Estes termos são regidos pelas leis da República Federativa do Brasil, com foro eleito na
                            comarca de [Cidade/UF] para dirimir eventuais controvérsias.
                        </p>
                    </section>

                    <section>
                        <h2>11. Contato</h2>
                        <p>
                            Dúvidas sobre estes termos podem ser enviadas para{" "}
                            <a
                                href="mailto:equipe.nextsolvesolution@gmail.com"
                                className="text-brand-500 hover:underline"
                            >
                                equipe.nextsolvesolution@gmail.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}