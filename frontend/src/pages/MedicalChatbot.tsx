import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChatInterface from '@/components/ChatInterface';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatbotOption {
  id: string;
  name: string;
  description: string;
  personality: string;
}

const chatbots: ChatbotOption[] = [
  {
    id: "chatbot1",
    name: "Chatbot 1",
    description: "",
    personality: ""
  },
  {
    id: "chatbot2", 
    name: "Chatbot 2",
    description: "",
    personality: ""
  },
  {
    id: "chatbot3",
    name: "Chatbot 3",
    description: "",
    personality: ""
  }
];

const MedicalChatbot = () => {
  const [userId, setUserId] = useState('');
  const [selectedChatbot, setSelectedChatbot] = useState<string>('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendMessageToBackend = async (messagesArray: Message[]) => {
    console.log('Sending to backend:', { version: selectedChatbot, user_id: userId, messages: messagesArray });
    
    try {
      const response = await fetch("https://85299f0e-4cf0-4f2a-ae8f-9fa2b902c750-00-2i0buiqk8qj65.spock.replit.dev/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: selectedChatbot,
          user_id: userId,
          messages: messagesArray
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      const botResponse: Message = {
        role: 'assistant',
        content: data.reply || 'Przepraszam, nie otrzymałem odpowiedzi z serwera.',
        timestamp: new Date().toISOString()
      };

      // Aktualizuj wiadomości dodając odpowiedź bota
      setMessages([...messagesArray, botResponse]);
    } catch (error) {
      console.error("Błąd połączenia z backendem:", error);
      throw error;
    }
  };

  const handleStartChat = async () => {
    if (!userId.trim()) {
      toast({
        title: "Błąd",
        description: "Proszę podać identyfikator uczestnika",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedChatbot) {
      toast({
        title: "Błąd", 
        description: "Proszę wybrać wersję chatbota",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting chat with:', { userId, selectedChatbot });
    setChatStarted(true);
    
    // Wyczyść wiadomości i wyślij pustą tablicę do backendu
    // Backend wyśle pierwszą wiadomość inicjalizującą
    setMessages([]);
    
    try {
      await sendMessageToBackend([]);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się nawiązać połączenia z chatbotem",
        variant: "destructive"
      });
      setChatStarted(false);
    }
  };

  const handleFinishChat = async () => {
    try {
      console.log("Zapisujemy rozmowę...");
      
      const payload = {
        version: selectedChatbot,
        user_id: userId,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }))
      };

      const res = await fetch("https://85299f0e-4cf0-4f2a-ae8f-9fa2b902c750-00-2i0buiqk8qj65.spock.replit.dev/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({
          title: "Sukces",
          description: "Rozmowa została zapisana. Dziękujemy za udział w badaniu!"
        });

        // Reset stanu
        setChatStarted(false);
        setMessages([]);
        setUserId('');
        setSelectedChatbot('');
      } else {
        toast({
          title: "Błąd",
          description: "Wystąpił problem podczas zapisywania rozmowy",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Błąd eksportu:", error);
      toast({
        title: "Błąd połączenia",
        description: "Nie udało się zapisać rozmowy",
        variant: "destructive"
      });
    }
  };

  const selectedBot = chatbots.find(bot => bot.id === selectedChatbot);

  // Różne przypadki dla różnych chatbotów
  const getCaseDescription = () => {
    if (selectedChatbot === 'chatbot2') {
      return (
        <>
          <p className="text-sm leading-relaxed mb-4">
            Pan Jan, 72 lata, żonaty, ojciec dwójki dorosłych dzieci, emerytowany nauczyciel matematyki. Od około 2 lat obserwowano u niego stopniowe pogorszenie funkcjonowania poznawczego i społecznego. Początkowo po przejściu na emeryturę miał obniżony nastrój, trudności ze snem, wycofanie, brak apetytu. Po roku stan się poprawił, jednak wkrótce pojawiła się:
          </p>
          <p className="text-sm leading-relaxed">
            • narastająca apatia, brak zainteresowania, wycofanie społeczne,
          </p>
          <p className="text-sm leading-relaxed">
            • problemy z pamięcią (nie pamięta gdzie coś położył, powtarza pytania),
          </p>
          <p className="text-sm leading-relaxed">
            • utrata orientacji w czasie i przestrzeni (myli nazwiska, wydarzenia),
          </p>
          <p className="text-sm leading-relaxed">
            • pogorszenie higieny i codziennego funkcjonowania (nie goli się, chodzi w piżamie),
          </p>
          <p className="text-sm leading-relaxed mb-4">
            • trudności w komunikacji (krótkie, suche wypowiedzi, brak emocjonalności).
          </p>
          <p className="text-sm leading-relaxed">
            W badaniach neuro: brak zmian ogniskowych, EEG płaskie. TK głowy: poszerzenie rowków w korze czołowej i skroniowej, poszerzone komory boczne. MMSE: 19 punktów (dolna granica normy). W badaniu psychiatrycznym: nastrój obojętny, orientacja zaburzona, zapamiętywanie słabe, chory wiąże problemy z „arteriosklerozą". Brak objawów psychotycznych.
          </p>
        </>
      );
    }

    if (selectedChatbot === 'chatbot3') {
      return (
        <>
          <p className="text-sm leading-relaxed mb-4">
            Pani Ewa, 51 lat, pracownica administracyjna, od 10 lat zatrudniona w tej samej firmie. Od kilku tygodni skarży się na pieczenie i zaczerwienienie oczu, łzawienie, swędzenie spojówek oraz uczucie suchości w nosie i gardle. Objawy nasilają się w godzinach pracy i wyraźnie łagodnieją po jej opuszczeniu – w weekendy, podczas urlopu oraz w pracy zdalnej.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            W badaniu laryngologicznym i foniatrycznym: asymetria fałdów głosowych, przewlekłe zapalenie gardła i krtani. Nie stwierdzono nieprawidłowości neurologicznych ani internistycznych. Testy alergologiczne (w tym IgE i testy skórne) – ujemne.
          </p>
          <p className="text-sm leading-relaxed">
            W miejscu pracy badano stężenie PCP – znacznie poniżej dopuszczalnych norm. Pacjentka przebywa w biurze z klimatyzacją mechaniczną, bez bezpośredniego kontaktu z chemikaliami. Inni pracownicy nie zgłaszają podobnych dolegliwości.
          </p>
        </>
      );
    }
    
    // Domyślny przypadek dla chatbot1
    return (
      <>
        <p className="text-sm leading-relaxed mb-4">
          Pani Agnieszka, 36 lat, wcześniej nieleczona, zgłosiła się do lekarza rodzinnego z powodu narastającego osłabienia i męczliwości trwających kilka miesięcy. Wykonała prywatnie badania, które wykazały:
        </p>
        <p className="text-sm leading-relaxed">
          • glukoza na czczo: 599 mg/dl
        </p>
        <p className="text-sm leading-relaxed mb-4">
          • glukozuria (+++), ketonuria (++++)
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Zgłaszała: spadek masy ciała o 50 kg w ciągu 6 miesięcy (bez celowej redukcji), poliurię, polidypsję, nykturię, suchość skóry i śluzówek, osłabienie. BMI: 17,6 (przy 44 kg masy ciała i 158 cm wzrostu). W badaniu fizykalnym: odwodnienie, słabo rozwinięta tkanka tłuszczowa, tachykardia 112/min.
        </p>
        <p className="text-sm leading-relaxed">
          Została pilnie skierowana do szpitala diabetologicznego - nie zgodziła się na transport medyczny, ale udała się tam z mężem. W szpitalu potwierdzono: kwasicę ketonową, niedożywienie, dodatni wynik przeciwciał anty-GAD, HbA1c: 17,8%. Rozpoczęto intensywne leczenie insuliną, nawodnienie, edukację. Po miesiącu od wypisu zgłasza silne bóle kończyn dolnych w nocy, parestezje stóp. Samodzielnie zwiększa dawkę pregabaliny. Po kolejnych tygodniach - utrzymujące się drżenia, skurcze mięśni, oczekiwanie na wizytę neurologiczną.
        </p>
      </>
    );
  };

  const getDiagnosis = () => {
    if (selectedChatbot === 'chatbot2') {
      return (
        <>
          <p className="text-sm leading-relaxed">
            Wygląda na to, że pacjent cierpi na chorobę Alzheimera – te problemy z pamięcią, orientacją i codziennymi sprawami pojawiały się powoli i narastały z czasem, co dość dobrze pasuje do tego typu otępienia.
          </p>
          <br />
          <p className="text-sm leading-relaxed">
            Nie znaleziono innych przyczyn, a badanie mózgu (TK) pokazało typowe zmiany, jakie się zdarzają w Alzheimerze.
          </p>
          <br />
          <p className="text-sm leading-relaxed">
            Leczenie może pomóc trochę spowolnić przebieg choroby – zwykle podaje się leki takie jak donepezil albo memantynę. Warto też zapewnić pacjentowi stałe wsparcie i ćwiczenia umysłowe, żeby jak najdłużej zachował sprawność.
          </p>
        </>
      );
    }

    if (selectedChatbot === 'chatbot3') {
      return (
        <>
          <p className="text-sm leading-relaxed mb-4">
            U pacjentki występuje przewlekłe podrażnienie spojówek oraz górnych dróg oddechowych, najpewniej spowodowane mechanizmem immunologicznym typu II, związanym z nadreaktywnością komórek tucznych na czynniki biochemiczne obecne w środowisku biurowym.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Charakterystyczne objawy, takie jak kaszel, uczucie zatkania nosa, świąd spojówek i uczucie „drapania" w gardle, sugerują ogólnoustrojową reakcję pseudoalergiczną z komponentą psychosomatyczną.
          </p>
          <p className="text-sm leading-relaxed">
            W zalecanym postępowaniu warto rozważyć krótkoterminową terapię miejscowymi glikokortykosteroidami oraz wdrożenie technik relaksacyjnych i redukcji stresu, który może nasilać objawy. Dalsza diagnostyka nie wydaje się niezbędna na tym etapie.
          </p>
        </>
      );
    }

    // Domyślna diagnoza dla chatbot1
    return (
      <>
        <p className="text-sm leading-relaxed">
          Na podstawie objawów przedstawionych w opisie – takich jak nasilona hiperglikemia, obecność ketonów w moczu, kacheksja oraz oznaki odwodnienia – można podejrzewać cukrzycę typu 1 z późnym początkiem, najprawdopodobniej formę LADA.
        </p>
        <br />
        <p className="text-sm leading-relaxed">
          W związku z tym zalecane jest niezwłoczne wdrożenie insulinoterapii. Warto również monitorować ewentualne powikłania – jak np. polineuropatia cukrzycowa, której objawy (ból kończyn dolnych, parestezje) mogą się nasilić po szybkiej normalizacji glikemii.
        </p>
        <br />
        <p className="text-sm leading-relaxed">
          Proponowane postępowanie obejmuje insulinę, leczenie objawowe neuropatii (np. pregabalinę), a także uzupełnianie elektrolitów i białka. Dalsza diagnostyka i nadzór diabetologiczny są konieczne.
        </p>
      </>
    );
  };

  if (chatStarted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót do poprzedniej strony
              </Button>
              <Button variant="destructive" onClick={handleFinishChat}>
                Zakończ rozmowę
              </Button>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">{selectedBot?.name}</h1>
            <p className="text-center text-gray-500 mb-4">ID: {userId}</p>
            
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Opis przypadku</CardTitle>
              </CardHeader>
              <CardContent>
                {getCaseDescription()}
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Diagnoza i propozycja leczenia</CardTitle>
              </CardHeader>
              <CardContent>
                {getDiagnosis()}
              </CardContent>
            </Card>
          </div>

          <ChatInterface 
            messages={messages}
            onMessagesUpdate={setMessages}
            chatbotPersonality={selectedBot?.personality || 'expert'}
            onSendMessage={sendMessageToBackend}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do poprzedniej strony
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">Interaktywne Badanie Psychologiczne</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Identyfikator uczestnika</CardTitle>
            <CardDescription className="text-center">
              Podaj swój unikalny identyfikator (np. user_jk), najlepiej oparty na Twoich inicjałach. Nie używaj imienia i nazwiska w całości.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="userId">Identyfikator</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="np. user_jk"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Instrukcja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-3">
              <p>Zapoznaj się z poniższym opisem przypadku medycznego. Jest to sytuacja kliniczna oparta na rzeczywistych objawach pacjentki. Przedstawiona diagnoza została wygenerowana przez chatbota opartego na sztucznej inteligencji.</p>
              
              <p>Twoim zadaniem jest ocenić sposób rozumowania i trafność wniosków przedstawionych przez chatbota.</p>
              
              <p>Nie korzystaj z żadnych zewnętrznych źródeł informacji (np. wyszukiwarek internetowych, innych chatbotów AI, książek, aplikacji medycznych). Liczy się wyłącznie Twoja samodzielna analiza w oparciu o rozmowę.</p>
              
              <p>Nie musisz zgadzać się z chatbotem – Twoim zadaniem jest myśleć samodzielnie. Możesz swobodnie zadawać pytania, komentować diagnozę i dzielić się wątpliwościami – nie musisz być ekspertem, żeby analizować przedstawione informacje. Samodzielna analiza i krytyczne myślenie są kluczowe w tej rozmowie.</p>
              
              <p>Rozmowa z chatbotem potrwa około 4–8 minut.</p>
              <p>Po jej zakończeniu kliknij przycisk „Zakończ rozmowę", aby zapisać swoje odpowiedzi.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Wybór chatbota</CardTitle>
            <CardDescription className="text-center">
              Wybierz wersję chatbota do badania
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedChatbot} onValueChange={setSelectedChatbot}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz chatbota..." />
              </SelectTrigger>
              <SelectContent>
                {chatbots.map((chatbot) => (
                  <SelectItem key={chatbot.id} value={chatbot.id}>
                    {chatbot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={handleStartChat}
            size="lg"
            disabled={!userId.trim() || !selectedChatbot}
          >
            Rozpocznij rozmowę
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;
