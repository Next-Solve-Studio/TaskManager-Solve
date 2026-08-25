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
                            Se você optar por conectar sua conta do Google na tela de Agenda, solicitamos a permissão{" "}
                            <code>https://www.googleapis.com/auth/calendar.events</code>. Usamos esse acesso
                            exclusivamente para:
                        </p>
                        <ul>
                            <li>Criar, atualizar e cancelar no seu Google Calendar as reuniões que você cria dentro do Task Manager Solve;</li>
                            <li>Gerar automaticamente o link de videochamada (Google Meet) dessas reuniões;</li>
                            <li>Convidar, por e-mail, os participantes que você mesmo seleciona na tela de criação da reunião.</li>
                        </ul>
                        <p>
                            Não lemos, listamos ou coletamos outros eventos já existentes na sua agenda pessoal —
                            o acesso é usado apenas para os eventos que o próprio sistema cria a seu pedido. Você pode
                            revogar essa permissão a qualquer momento pela própria tela de Agenda ou diretamente em{" "}
                            <a
                                href="https://myaccount.google.com/permissions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-500 hover:underline"
                            >
                                myaccount.google.com/permissions
                            </a>
                            .
                        </p>
                        <p>
                            O uso e a transferência de informações recebidas das APIs do Google pelo Task Manager
                            Solve seguem a{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-500 hover:underline"
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