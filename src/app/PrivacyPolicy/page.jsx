export const metadata = {
    title: "Política de Privacidade | Task Manager Solve",
    description: "Como o Task Manager Solve coleta, usa e protege os seus dados.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-bg-main text-text-primary">
            <div className="max-w-3xl mx-auto px-6 py-14">
                <a href="/" className="text-sm text-brand-500 hover:underline">
                    ← Voltar
                </a>

                <h1 className="text-3xl font-bold mt-4 mb-2">Política de Privacidade</h1>
                <p className="text-sm text-text-muted mb-10">Última atualização: 25 de agosto de 2026</p>

                <div className="space-y-8 text-text-secondary leading-relaxed [&_h2]:text-text-primary [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                    <section>
                        <p>
                            Esta Política de Privacidade descreve como o <strong>Task Manager Solve</strong>, operado
                            por 61.303.644 GUILHERME BARROSO JUCA, CNPJ nº 61.303.644/0001-43 ("nós"), coleta, usa,
                            armazena e protege as informações de quem utiliza a plataforma ("você").
                        </p>
                    </section>

                    <section>
                        <h2>1. Quais dados coletamos</h2>
                        <p>Coletamos os dados necessários para o funcionamento do sistema de gestão de tarefas:</p>
                        <ul>
                            <li>Dados de cadastro: nome, e-mail, cargo e empresa vinculada.</li>
                            <li>Dados de uso: tarefas, projetos, clientes, agenda e registros de atividade que você cria dentro do sistema.</li>
                            <li>Dados técnicos: endereço IP, tipo de navegador e registros de acesso, para segurança e prevenção de fraude.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Integração com o Google Calendar</h2>
                        <p>
                            Se você optar por conectar sua conta do Google na tela de Agenda, usamos a API do Google
                            Calendar (OAuth, escopo <code>https://www.googleapis.com/auth/calendar.events</code>) para
                            oferecer a criação de reuniões com link do Google Meet diretamente na plataforma.
                        </p>

                        <p><strong>Quais dados de usuário do Google acessamos</strong></p>
                        <ul>
                            <li>O endereço de e-mail principal da sua Conta do Google, usado apenas para identificar qual conta está conectada.</li>
                            <li>Os dados dos eventos que o próprio Task Manager Solve cria no seu Google Calendar em seu nome: título, descrição, data, horário e a lista de participantes que você define na tela de criação da reunião.</li>
                            <li>O link de videochamada (Google Meet) gerado automaticamente para esses eventos.</li>
                        </ul>
                        <p>
                            Não acessamos, lemos, listamos ou armazenamos nenhum outro evento já existente na sua
                            agenda do Google — o acesso é usado somente para os eventos que o próprio sistema cria a
                            seu pedido.
                        </p>

                        <p><strong>Como usamos esses dados</strong></p>
                        <ul>
                            <li>Criar o evento no seu Google Calendar quando você cria uma reunião no sistema;</li>
                            <li>Atualizar esse evento quando você edita a reunião (horário, título, participantes);</li>
                            <li>Cancelar/excluir esse evento no Google Calendar quando você exclui a reunião no sistema;</li>
                            <li>Gerar e exibir o link do Google Meet vinculado ao evento.</li>
                        </ul>
                        <p>Não usamos esses dados para publicidade, perfilamento de usuários ou qualquer finalidade fora da criação/gestão dessas reuniões.</p>

                        <p><strong>Com quem compartilhamos, transferimos ou divulgamos esses dados</strong></p>
                        <ul>
                            <li>Com os participantes que você mesmo seleciona ao criar a reunião — eles recebem o convite do evento diretamente do Google Calendar (mecanismo padrão do próprio Google), não por um envio nosso.</li>
                            <li>Não vendemos, alugamos, nem compartilhamos esses dados com anunciantes, corretores de dados ou qualquer terceiro para fins comerciais.</li>
                            <li>Não transferimos esses dados para nenhum outro serviço além do próprio Google Calendar (via API) e do banco de dados do Task Manager Solve (Firestore, Google Cloud), usado só para manter a referência do evento dentro do sistema.</li>
                        </ul>

                        <p><strong>Como protegemos esses dados</strong></p>
                        <ul>
                            <li>O token de acesso à sua conta do Google (refresh token) fica isolado numa coleção do banco de dados que nenhum usuário — nem administradores da empresa — consegue ler pelo aplicativo; só o servidor consegue usá-lo, com credenciais de administrador que nunca chegam ao navegador.</li>
                            <li>Toda comunicação com a API do Google acontece via HTTPS/TLS.</li>
                            <li>O token só é utilizado no exato momento em que você cria, edita ou cancela uma reunião — não fazemos sincronizações automáticas nem chamadas em segundo plano.</li>
                            <li>Você pode revogar esse acesso a qualquer momento pela própria tela de Agenda ou diretamente em{" "}
                                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                                    myaccount.google.com/permissions
                                </a>.
                            </li>
                        </ul>

                        <p><strong>Retenção e exclusão dos dados do Google</strong></p>
                        <p>
                            O token de acesso é mantido apenas enquanto sua conta do Google estiver conectada. Ao
                            desconectar (pela tela de Agenda) ou ao excluir sua conta no Task Manager Solve, o token é
                            apagado permanentemente do nosso banco de dados de forma imediata. Os eventos já criados no
                            seu Google Calendar não são apagados automaticamente ao desconectar — eles continuam lá até
                            você excluí-los pelo próprio Google Calendar ou pelo Task Manager Solve, enquanto ainda
                            estiver conectado.
                        </p>

                        <p>
                            O uso e a transferência de informações recebidas das APIs do Google pelo Task Manager
                            Solve seguem a{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Política de Dados do Usuário dos Serviços de API do Google
                            </a>
                            , incluindo os requisitos de Uso Limitado.
                        </p>
                    </section>

                    <section>
                        <h2>3. Como usamos os dados</h2>
                        <p>
                            Usamos os dados coletados para autenticar seu acesso, exibir as informações da sua
                            empresa, gerar relatórios internos de produtividade e enviar comunicações operacionais
                            (como códigos de verificação e notificações do sistema).
                        </p>
                    </section>

                    <section>
                        <h2>4. Compartilhamento de dados</h2>
                        <p>
                            Não vendemos nem alugamos seus dados. Compartilhamos informações apenas: com os demais
                            usuários da sua própria empresa (conforme as permissões definidas pelo administrador da
                            conta); com participantes de reuniões que você mesmo convida; e com prestadores de
                            serviço estritamente necessários para operar a plataforma (ex.: hospedagem, envio de
                            e-mails e processamento de pagamentos), sob obrigação contratual de confidencialidade.
                        </p>
                    </section>

                    <section>
                        <h2>5. Retenção e exclusão de dados</h2>
                        <p>
                            Mantemos seus dados enquanto sua conta estiver ativa. Você pode solicitar a exportação
                            ou a exclusão dos seus dados pessoais a qualquer momento, conforme a Lei Geral de
                            Proteção de Dados (LGPD), entrando em contato pelo e-mail abaixo.
                        </p>
                    </section>

                    <section>
                        <h2>6. Seus direitos (LGPD)</h2>
                        <p>
                            Você tem direito a confirmar a existência de tratamento, acessar, corrigir, solicitar a
                            portabilidade, anonimizar ou excluir os seus dados, e revogar consentimentos concedidos
                            (como o acesso ao Google Calendar) a qualquer momento.
                        </p>
                    </section>

                    <section>
                        <h2>7. Cookies</h2>
                        <p>
                            Usamos um único cookie de sessão, essencial para manter você autenticado, sem finalidade
                            de publicidade ou rastreamento entre sites.
                        </p>
                    </section>

                    <section>
                        <h2>8. Segurança</h2>
                        <p>
                            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
                            autorizado, perda ou alteração, incluindo controle de acesso por perfil e criptografia em
                            trânsito.
                        </p>
                    </section>

                    <section>
                        <h2>9. Alterações nesta política</h2>
                        <p>
                            Podemos atualizar esta política periodicamente. Alterações relevantes serão comunicadas
                            dentro da própria plataforma.
                        </p>
                    </section>

                    <section>
                        <h2>10. Contato</h2>
                        <p>
                            Dúvidas sobre esta política ou sobre seus dados podem ser enviadas para{" "}
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

