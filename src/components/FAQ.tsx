import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Como são calculadas as porcentagens das áreas da vida?",
    answer: `Nosso app usa um sistema astrológico avançado que considera:

🔮 **Posições Planetárias:** Cada planeta influencia diferentes áreas da sua vida. Por exemplo, Vênus influencia o amor, Marte a energia, Saturno a carreira.

👑 **Dignidades Planetárias:** Quando um planeta está no "seu signo" (como Sol em Leão), ele fica mais forte e influencia positivamente. Quando está "fora de casa", pode criar desafios.

✨ **Aspectos Astrológicos:** São "conversas" entre os planetas. Aspectos harmônicos (como trígonos) geram energias positivas, enquanto aspectos desafiadores (como quadraturas) podem criar tensões que precisam ser trabalhadas.

🏠 **Casas Astrológicas:** São 12 áreas da vida no seu mapa natal. Planetas em casas específicas influenciam diretamente essas áreas.

A porcentagem final combina todos esses fatores usando fórmulas astronômicas tradicionais, resultando em uma análise personalizada baseada no seu momento e local de nascimento.`
  },
  {
    question: "O que significam os status das áreas da vida?",
    answer: `Cada área da vida recebe uma porcentagem que indica:

📈 **70-95%:** Período excelente! As energias planetárias estão trabalhando a seu favor. Momento ideal para tomar iniciativas e aproveitar oportunidades.

⚖️ **50-69%:** Período equilibrado. As energias estão estáveis, com oportunidades moderadas. Bom momento para manter o que já está funcionando.

⚠️ **30-49%:** Período que requer atenção. Não é necessariamente "ruim", mas indica que você deve ser mais cauteloso e estratégico.

🚨 **Abaixo de 30%:** Status crítico. As energias planetárias sugerem desafios maiores. Momento para ter paciência, buscar apoio e evitar decisões importantes quando possível.

Lembre-se: a astrologia mostra tendências, não destinos fixos. Você sempre tem livre arbítrio para tomar suas decisões!`
  },
  {
    question: "Como funcionam os grupos e as notificações?",
    answer: `Os grupos permitem que você se conecte com pessoas importantes:

👥 **Criação de Grupos:** Você pode criar grupos com família, amigos ou pessoas próximas. Cada grupo tem um código único para convidar outros membros.

🔔 **Alertas Automáticos:** Quando uma das suas áreas da vida entra em status crítico (abaixo de 30%), os outros membros do grupo recebem uma notificação automática.

💬 **Mensagens Personalizadas:** Nas configurações, você pode personalizar as mensagens que serão enviadas para cada área da vida quando ela estiver crítica. Por exemplo: "Estou passando por um momento desafiador no amor, poderia usar um pouco de apoio ❤️"

🛡️ **Privacidade:** Você controla quais grupos recebem quais tipos de alerta. Suas informações astrológicas detalhadas permanecem privadas - apenas o status de alerta é compartilhado.

🎯 **Objetivo:** O sistema foi criado para fortalecer sua rede de apoio, permitindo que as pessoas próximas saibam quando você pode precisar de ajuda ou carinho extra.`
  },
  {
    question: "Por que preciso informar data, hora e local de nascimento?",
    answer: `Estas informações são fundamentais para a precisão astrológica:

📅 **Data de Nascimento:** Define as posições básicas dos planetas no dia em que você nasceu, criando seu "mapa astral" único.

⏰ **Hora de Nascimento:** Determina seu Ascendente e as Casas Astrológicas. A hora afeta drasticamente a interpretação - mesmo alguns minutos de diferença podem mudar o resultado.

🌍 **Local de Nascimento:** O local exato é necessário para calcular as posições planetárias corretas em relação ao seu ponto de vista na Terra.

🔒 **Segurança:** Seus dados pessoais são protegidos e criptografados. Usamos apenas para cálculos astrológicos e nunca compartilhamos com terceiros.

✨ **Resultado:** Com essas informações, podemos calcular com precisão como os planetas estão influenciando sua vida hoje, comparando as posições atuais com seu mapa natal.`
  },
  {
    question: "O que torna este aplicativo tão preciso e diferente dos outros?",
    answer: `🏆 **Este app possui um dos sistemas de cálculo astrológico mais precisos do mercado, considerando fatores que a maioria dos apps ignora!**

⭐ **Diferenciais únicos:**
- **Dignidades Planetárias Completas:** Analisamos exaltação, domicílio, exílio e queda de cada planeta
- **Sistema Avançado de Aspectos:** Consideramos orbes precisos, força dos aspectos e se estão aplicando ou separando
- **Velocidade Planetária:** Planetas retrógrados e sua velocidade afetam diretamente os cálculos
- **Casas Astrológicas Detalhadas:** Posição exata dos planetas nas 12 casas da vida
- **Cálculos em Tempo Real:** Atualizações constantes conforme o movimento planetário

🔬 **Tecnologia de ponta:**
- API Prokerala (referência mundial em dados astronômicos)
- Algoritmos baseados em efemérides oficiais da NASA
- Sistema de confiança que indica a precisão de cada cálculo

📊 **Resultado:** Enquanto outros apps dão porcentagens genéricas, nós oferecemos análises personalizadas baseadas em sua data, hora e local EXATOS de nascimento.

🎯 **Para você isso significa:** Orientações mais assertivas, alertas mais precisos e um verdadeiro mapa energético da sua vida atual!`
  },
  {
    question: "O app substitui um astrólogo profissional?",
    answer: `Não, nosso app é um **complemento** à astrologia profissional:

🤖 **O que nosso app faz:**
- Cálculos matemáticos precisos das posições planetárias
- Interpretações automáticas baseadas em regras astrológicas tradicionais
- Monitoramento contínuo dos trânsitos planetários
- Sistema de apoio através dos grupos

👨‍🏫 **O que um astrólogo profissional oferece:**
- Interpretação personalizada e contextualizada
- Análise profunda de temas específicos da sua vida
- Orientação para questões complexas
- Visão holística considerando sua história pessoal

🎯 **Nosso objetivo:** Democratizar o acesso à astrologia básica e criar uma rede de apoio emocional. Para análises profundas ou questões importantes da vida, sempre recomendamos consultar um astrólogo qualificado.

💡 **Dica:** Use nosso app como um "barômetro" energético diário e procure um profissional quando precisar de orientação mais específica.`
  },
  {
    question: "Como posso confiar nos cálculos do aplicativo?",
    answer: `📈 **Nosso compromisso é com a máxima precisão astrológica possível:**

🔒 **Fontes Oficiais:** 
- Dados da API Prokerala (padrão-ouro mundial)
- Efemérides astronômicas da NASA
- Atualizações em tempo real das posições planetárias

🎓 **Metodologia Rigorosa:**
- Tradições astrológicas milenares combinadas com tecnologia moderna
- Testes extensivos para calibrar cada fator
- Sistema de pesos baseado em estudos clássicos

✨ **Transparência Total:**
- Nível de confiança mostrado em cada cálculo
- Explicações claras sobre como chegamos aos resultados
- Alertas quando a precisão pode estar limitada

🚀 **Resultado Comprovado:** 
Nosso app supera em precisão a maioria dos aplicativos gratuitos e até mesmo alguns pagos, oferecendo análises que se aproximam da qualidade de software profissional.

💎 **Garantia:** Se você comparar nossos cálculos com outros apps, verá a diferença na qualidade e detalhamento das informações!`
  }
]

interface FAQProps {
  visible: boolean
  onClose: () => void
}

export default function FAQ({ visible, onClose }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Como este aplicativo funciona?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Bem-vindo ao seu guia completo! Aqui você encontra tudo sobre como calculamos suas porcentagens astrológicas e como o sistema de grupos funciona.
          </Text>

          {faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={expandedItems.has(index) ? "remove" : "add"}
                  size={20}
                  color="#8B5FBF"
                />
              </TouchableOpacity>

              {expandedItems.has(index) && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌟 Tem mais dúvidas? Entre em contato conosco através das configurações!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1B69',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  intro: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginVertical: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B69',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F8F6FF',
  },
  answer: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    textAlign: 'left',
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#2D5016',
    textAlign: 'center',
    lineHeight: 20,
  },
})