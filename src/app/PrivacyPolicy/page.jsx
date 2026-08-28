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
                <p className="text-sm text-text-muted mb-10">Última atualização: 28 de agosto de 2026</p>

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
                            Calendar (OAuth, escopo <code>https://www.googleapis.com/auth/calendar.events</code> e{" "}
                            <code>https://www.googleapis.com/auth/userinfo.email</code>) para oferecer a criação de
                            reuniões com link do Google Meet diretamente na plataforma.
                        </p>

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Quais dados do usuário do Google acessamos</h3>
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

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Como o app usa os dados do usuário do Google</h3>
                        <ul>
                            <li>Criar o evento no seu Google Calendar quando você cria uma reunião no sistema;</li>
                            <li>Atualizar esse evento quando você edita a reunião (horário, título, participantes);</li>
                            <li>Cancelar/excluir esse evento no Google Calendar quando você exclui a reunião no sistema;</li>
                            <li>Gerar e exibir o link do Google Meet vinculado ao evento.</li>
                        </ul>
                        <p>
                            O acesso aos dados do Google é usado exclusivamente para fornecer os recursos de criação de
                            reuniões visíveis na interface do Task Manager Solve. Não usamos esses dados para publicidade,
                            perfilamento, treinamento de modelos de inteligência artificial ou qualquer finalidade
                            diferente da descrita acima.
                        </p>

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Com quem compartilhamos, transferimos ou divulgamos dados do usuário do Google</h3>
                        <ul>
                            <li>Com os participantes que você mesmo seleciona ao criar a reunião — eles recebem o convite do evento diretamente do Google Calendar (mecanismo padrão do próprio Google).</li>
                            <li>Não vendemos, alugamos, nem compartilhamos esses dados com anunciantes, corretores de dados ou qualquer terceiro para fins comerciais.</li>
                            <li>Não transferimos esses dados para nenhum outro serviço além do próprio Google Calendar (via API) e do banco de dados do Task Manager Solve (Firestore, Google Cloud), utilizado apenas para manter a referência interna do evento.</li>
                            <li>Não permitimos que pessoas físicas leiam dados do usuário do Google, exceto quando estritamente necessário por razões de segurança ou obrigação legal.</li>
                        </ul>

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Mecanismos de proteção de dados sensíveis</h3>
                        <ul>
                            <li>O token de acesso à sua conta do Google (refresh token) fica isolado em uma coleção do banco de dados com acesso restrito ao servidor da aplicação, por meio de credenciais de administrador que nunca chegam ao navegador do usuário.</li>
                            <li>Toda comunicação com a API do Google acontece via HTTPS/TLS com criptografia em trânsito.</li>
                            <li>O token só é utilizado no exato momento em que você cria, edita ou cancela uma reunião — não realizamos sincronizações automáticas nem chamadas em segundo plano.</li>
                            <li>Você pode revogar esse acesso a qualquer momento pela própria tela de Agenda ou diretamente em{" "}
                                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                                    myaccount.google.com/permissions
                                </a>.
                            </li>
                        </ul>

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Retenção e exclusão de dados do usuário do Google</h3>
                        <p>
                            O token de acesso é mantido apenas enquanto sua conta do Google estiver conectada. Ao
                            desconectar (pela tela de Agenda) ou ao excluir sua conta no Task Manager Solve, o token é
                            apagado permanentemente do nosso banco de dados de forma imediata. Os eventos já criados no
                            seu Google Calendar não são apagados automaticamente ao desconectar — eles continuam lá até
                            você excluí-los pelo próprio Google Calendar ou pelo Task Manager Solve enquanto ainda estiver
                            conectado.
                        </p>

                        <h3 className="text-text-primary font-semibold text-base mt-4 mb-2">Conformidade com a Política de Dados do Usuário dos Serviços de API do Google</h3>
                        <p>
                            O uso e a transferência de informações recebidas das APIs do Google pelo Task Manager Solve
                            estão em conformidade com a{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-500 hover:underline"
                            >
                                Política de Dados do Usuário dos Serviços de API do Google
                            </a>
                            , incluindo os requisitos de Uso Limitado (<em>Limited Use</em>). Os dados recebidos das APIs
                            do Google são usados apenas para fornecer ou melhorar funcionalidades voltadas ao usuário que
                            são visíveis e esperadas na interface do aplicativo, e não para nenhuma outra finalidade.
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

