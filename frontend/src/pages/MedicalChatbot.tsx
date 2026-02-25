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
    name: "Chatbot (przypadek Ewy)",
    description: "",
    personality: ""
  },
  {
    id: "chatbot2", 
    name: "Chatbot (przypadek Jana)",
    description: "",
    personality: ""
  },
  {
    id: "chatbot3",
    name: "Chatbot (przypadek Dariusza)",
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
            Na podstawie poniższego opisu, bardzo proszę o wstępną diagnozę mojego dziadka.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Opis pacjenta:<br />
            Pan Jan, mężczyzna, 72 lata, wykształcenie wyższe, żonaty, ojciec dwójki dorosłych dzieci.
            Emerytowany nauczyciel matematyki (40 lat pracy, sukcesy dydaktyczne, dyrektor szkoły),
            od 7 lat na emeryturze. Osoba spokojna, zrównoważona, bez nałogów, wcześniej zdrowa. W
            przeszłości aktywny fizycznie (biegi, spacery, turystyka), poważnie nie chorował,
            sporadycznie "przeziębienia". Wywiad rodzinny: ojciec z nasilonymi zaburzeniami pamięci
            (zgon z powodu miażdżycy), matka - nadciśnienie i zawał serca.
          </p>
          <p className="text-sm leading-relaxed">
            Objawy:<br />
            Faza 1: epizod depresyjny (przygnębienie, izolacja, zaburzenia snu i apetytu, poczucie
            zbędności). Ustąpił samoistnie.
          </p>
          <p className="text-sm leading-relaxed">
            Faza 2: chwilowa poprawa - kontakty towarzyskie, plany powrotu do pracy.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Faza 3: stopniowe pogorszenie – apatia, wycofanie społeczne, bierność, brak aktywności.
            Większość czasu spędza przed telewizorem, zaniedbuję higienę, preferuje piżamę. Rzadko
            wychodzi z domu, unika znajomych, utrata inicjatywy („nie ma o czym rozmawiać").
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Aktualne zaburzenia poznawcze i zachowania:<br />
            • narastające problemy z pamięcią świeżą (gubienie przedmiotów, powtarzanie pytań),<br />
            • trudności z orientacją w czasie (nie zna daty, dnia tygodnia), ograniczona znajomość
            aktualnych wydarzeń,<br />
            • zapomina, czy jadł posiłek, ale mówi płynnie o dawnych wydarzeniach,<br />
            • okazjonalna drażliwość i napady złości, ogólny nastrój zobojętniały,<br />
            • sen dość dobry (noc + 2 h drzemki).
          </p>
          <p className="text-sm leading-relaxed">
            Badania i konsultacje:<br />
            • Neurolog: brak ogniskowych objawów, dno oka prawidłowe.<br />
            • Tomografia komputerowa: poszerzenie rowków zakrętów płatów czołowych i
            skroniowych, symetryczne poszerzenie komór bocznych.<br />
            • EEG: zapis płaski.<br />
            • Internista: stan somatyczny dobry, EKG prawidłowe, ciśnienie 125/70 mmHg.
            Badania laboratoryjne, glikemia, elektrolity, lipidogram - w normie.<br />
            • Psychiatra: pacjent ma świadomość zachowaną, wypowiedzenia zwięzłe, ton
            monotonny, nastrój obojętny. Nie inicjuje kontaktu, ale wypowiada się ciepło o
            rodzinie. Brak objawów psychotycznych.<br />
            • Funkcje poznawcze: pamięć wydarzeń z przeszłości zachowana - badany pamięta fakty i daty, choć relacjonuje je zwięźle. Poprawnie odtwarza przebieg pracy i życie osobiste. Znaczne braki w orientacji co do bieżących wydarzeń (nazwiska, daty). Orientacja w czasie częściowo zachowana - zna rok i porę roku, miesiąc po zastanowieniu, nie zna dokładnej daty. W próbie zapamiętania pięciu liczb: natychmiast trzy, po kilku minutach dwie. MMSE - 19 punktów (otępienie lekkiego stopnia).
          </p>
        </>
      );
    }

    if (selectedChatbot === 'chatbot3') {
      return (
        <>
          <p className="text-sm leading-relaxed mb-4">
            Na podstawie poniższego opisu, bardzo proszę o wstępną diagnozę mojego kuzyna.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Opis pacjenta:<br />
            Pan Dariusz, mężczyzna, 39 lat, cukrzyca rozpoznana przed 4 laty oraz nadwaga. Pacjent zgłosił się do poradni specjalistycznej z powodu uporczywej hiperglikemii na czczo.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Wywiad:<br />
            • Cukrzycę wykryto w wieku 35 lat na podstawie wyników 2-krotnego oznaczenia glikemii na czczo, wówczas cukrzyca została zdiagnozowana przy glikemii 7,9 i 8,4 mmol/l (142 mmol/l i 151 mg/dl). Ponieważ u pacjenta nie występowały objawy klinicznie choroby ani kwasica, a miał on nadwagę, to rozpoznano cukrzycę typu 2 i wdrożono leczenie dietetyczne. Chory zakupił glukometr i w pierwszym roku stosowania diety glikemia poranana wynosiła:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;• na czczo 7,5-8,5, śr. 8,0 mmol/l (136-154, śr. 144 mg/dl)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;• 2 h po śniadaniu 7,3-9,3, śr. 8,2 mmol/l (132-168, śr. 147 mg/dl)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;• 2 h po obiedzie 7,7-9,9, śr. 8,7 mmol/l (139-179, śr. 156 mg/dl)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;• 2 h po kolacji 7,3-9,5, śr. 8,4 mmol (132-171, śr. 151 mg/dl)<br />
            Ostatnio HbA1c wynosił w tym czasie 6,9-7,1. Wyrównanie cukrzycy uznano za niewystarczające i rozpoczęto leczenie metforminą w dawce 500 mg 3 x dz. Po 6 miesiącach średnia glikemia na czczo wynosiła 7,8 mmol/l (141 mg/dl), HbA1c 6,8 mmol/l, 2 h po posiłku 8,3 mmol/l (149 mg/dl) a HbA1c 7,0%. Dawkę metforminy zwiększono do 850 mg 3 x dz., jednak nie uzyskano istotnej poprawy glikemii. Do leczenia dołączono glimepiryd w zwiększanej dawce (ostatecznie 8 mg/d), ale glikemia na czczo nadal nie uległa istotnemu zmniejszeniu. W tej sytuacji do leków doustnych w niezmienionej dawce dołączono insulinę izofaną. Przy dawce 32 j./d podawanej s.c. wieczorem uzyskano zmniejszenie stężenia glukozy na czczo jedynie do średnio 7,5 mmol/l (135 mg/dl).<br />
            • Pacjent nie podaje w wywiadzie żadnych innych chorób, nie przyjmuje na stałe żadnych innych leków.<br />
            • Systematycznie raz w roku poddaje się badaniu w kierunku przewlekłych powikłań cukrzycy - dotąd nie stwierdzono żadnych.<br />
            • Na cukrzycę chorowała matka pacjenta - trudno określić, w jakim wieku zachorowała, nabywała chorobę. Rozpoznano u niej w wieku 56 lat; otrzymywała leki doustne. Najprawdopodobniej na cukrzycę chorowała także babcia ze strony matki. Pacjent ma siostrę, u której rozpoznano cukrzycę w trakcie ciąży - wdrożono wówczas leczenie insuliną, po porodzie leczenie lekami doustnymi.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Badanie przedmiotowe:<br />
            • Wzrost 178 cm, masa ciała 86 kg (BMI 27,1 kg/m2), tętno 64/min, ciśnienie tętnicze 125/75 mm Hg.
          </p>
          <p className="text-sm leading-relaxed">
            Badania pomocnicze:<br />
            • Badania laboratoryjne: bez istotnych nieprawidłowości poza zwiększoną glikemią na czczo<br />
            • EKG: rytm zatokowy miarowy 65/min, normogram, odstęp QT 410 ms<br />
            • Konsultacja stomatologiczna i laryngologiczna - nie stwierdzono ognisk zakażenia.
          </p>
        </>
      );
    }
    
    // Domyślny przypadek dla chatbot1
    return (
      <>
        <p className="text-sm leading-relaxed mb-4">
          Na podstawie poniższego opisu, bardzo proszę o wstępną diagnozę mojej mamy.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Opis pacjenta:<br />
          Pani Ewa, kobieta, 51 lat, niepaląca, pracująca od około 30 lat w charakterze pracownika administracyjnego (praca biurowa).
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Objawy:<br />
          • Podrażnienia spojówek (zaczerwienienie, świąd o niewielkim nasileniu, uczucie piasku pod powiekami, okresowo nadmierne łzawienie).<br />
          • Od kilku lat objawy sugerujące wystąpienie przewlekłego nieżytu gardła i krtani (uczucie suchości i drapania w gardle oraz pojawianie się okresowej dysfonii), które uległy znacznemu nasileniu równocześnie z pojawieniem się dolegliwości spojówkowych.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Badania i konsultacje:<br />
          • Okulista: dyskretne przekrwienie powierzchowne i lekki obrzęk spojówek obu oczu, bez wydzieliny patologicznej w worku spojówkowym<br />
          • Laryngolog: przewlekły prosty nieżyt błony śluzowej gardła i krtani.<br />
          • Alergolog: testy skórne metodą punktową z powszechnie występującymi alergenami środowiska domowego i komunalnego - wyniki ujemne. Brak występowania swoistych IgE w surowicy dla podstawowych alergenów środowiskowych.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          Dodatkowy wywiad:<br />
          U pacjentki obserwowano wyraźne złagodzenie dolegliwości podczas urlopu/przerwy od pracy oraz ich ponowne nasilenie po powrocie do biura. Ponieważ w charakterystyce jej stanowiska pracy nie wykazano narażenia na czynniki o charakterze drażniącym, szczególną uwagę zwrócono na otoczenie, w jakim pacjentka przebywa w czasie wykonywania obowiązków służbowych. Tydzień przed pojawieniem się pierwszych objawów w pomieszczeniu biurowym przeprowadzono remont - zamontowano nowe płyty pilśniowe impregnowane ksylamitem (zawierającym PCP). W powietrzu pomieszczenia stwierdzono obecność PCP w stężeniu 0,02 mg/m³ - powyżej normatywu dla środowiska komunalnego (0,01 mg/m³), ale poniżej wartości NDS dla środowiska pracy (0,5 mg/m³). Podobne dolegliwości zgłosiło kilka innych osób zatrudnionych w tym biurze.
        </p>
         <p className="text-sm leading-relaxed mb-2">
           Dalsze badania i konsultacje:<br />
           • Instytut Medycyny Pracy: nie stwierdzono odchyleń od normy (w tym ze strony obwodowego oraz ośrodkowego układu nerwowego).<br />
           • Podstawowe badania laboratoryjne: morfologia krwi, stężenia elektrolitów, parametry czynnościowe wątroby, gospodarka węglowodanowa - prawidłowe.<br />
           • Laryngolog i foniatra: asymetria fałdów głosowych (lewy nieco grubszy od prawego), z zaznaczonym rowkiem głośni, oraz wyraźnie widoczny rysunek naczyń obu fałdów głosowych. Rozpoznania kliniczne w konsultacji laryngologicznej i foniatrycznej: przewlekły suchy nieżyt gardła, przewlekły prosty nieżyt krtani z asymetrią fałdów głosowych i objawami dysfonii hiperfunkcjonalnej.
         </p>
      </>
    );
  };

  const getDiagnosis = () => {
    if (selectedChatbot === 'chatbot2') {
      return (
        <>
           <p className="text-sm leading-relaxed mb-2">
             Wygląda na to, że pacjent cierpi na chorobę Alzheimera – te problemy z pamięcią, orientacją i codziennymi sprawami pojawiały się powoli i narastały z czasem, co dość dobrze pasuje do tego typu otępienia.
           </p>
           <p className="text-sm leading-relaxed mb-2">
             Nie znaleziono innych przyczyn, a badanie mózgu (TK) pokazało typowe zmiany, jakie się zdarzają w Alzheimerze.
           </p>
           <p className="text-sm leading-relaxed">
             Leczenie może pomóc trochę spowolnić przebieg choroby – zwykle podaje się leki takie jak donepezil albo memantynę. Warto też zapewnić pacjentowi stałe wsparcie i ćwiczenia umysłowe, żeby jak najdłużej zachował sprawność.
           </p>
        </>
      );
    }

    if (selectedChatbot === 'chatbot3') {
      return (
        <>
           <p className="text-sm leading-relaxed mb-2">
             Na podstawie dostępnych informacji można stwierdzić, że u pacjenta występują utrzymujące się zaburzenia gospodarki węglowodanowej, które rozpoczęły się w stosunkowo młodym wieku (35 lat) i cechują się dominującą hiperglikemią na czczo oraz niewystarczającą odpowiedzią na leczenie dietetyczne w stosunku do młodego wieku. Prawdopodobnym rozpoznaniem jest cukrzyca mitochondrialna dziedziczona po linii matczynej (MIDD - Maternally Inherited Diabetes and Deafness).
           </p>
           
            <p className="text-sm mb-1">Uzasadnienie rozpoznania:</p>
           <p className="text-sm leading-relaxed mb-2">
             Dane wskazują, że pacjent spełnia kryteria sugerujące MIDD:<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• początek choroby w młodym wieku dorosłym (35 lat),<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• utrzymująca się hiperglikemia na czczo przy umiarkowanych wartościach HbA1c,<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• brak współistniejących chorób i powikłań naczyniowych mimo kilkuletnego rozpoznania,<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• wyraźna historia rodzinna cukrzycy w linii żeńskiej (matka, babcia, siostra),<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• niewystarczająca kontrola glikemii przy stosowaniu metforminy i pochodnej sulfonylomocznika, co doprowadziło do konieczności wdrożenia insuliny w krótkim czasie od rozpoznania,<br />
             &nbsp;&nbsp;&nbsp;&nbsp;• profil metaboliczny bez istotnej otyłości i bez innych zaburzeń sugerujących klasyczną cukrzycę typu 2.
           </p>
           
            <p className="text-sm mb-1">Proponowane leczenie i postępowanie:</p>
           <p className="text-sm leading-relaxed mb-2">
              &nbsp;&nbsp;&nbsp;&nbsp;• Kontynuacja insulinoterapii w dawkach dostosowanych do profilu glikemii.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;• Rewizja farmakoterapii doustnej: ograniczenie pochodnych sulfonylomocznika ze względu na niską skuteczność w MIDD.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;• Monitorowanie powikłań pozatrzustkowych: badanie audiometryczne w kierunku niedosłuchu, ocena funkcji nerek (bialaruria), albuminuria, kontrola okulistyczna.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;• Poradnictwo genetyczne dla rodziny - ze względu na dziedziczenie mitochondrialne.<br />
              &nbsp;&nbsp;&nbsp;&nbsp;• Edukacja pacjenta i bliskich w zakresie przewlekłego charakteru choroby oraz potencjalnych objawów pozatrzustkowych.
           </p>
        </>
      );
    }

    // Domyślna diagnoza dla chatbot1
    return (
      <>
         <p className="text-sm leading-relaxed mb-2">
           Na podstawie dostępnych informacji można stwierdzić obecność dolegliwości ze strony spojówek, gardła i krtani, powodujących dyskomfort i pogorszenie jakości życia pacjentki. Uwzględniając wywiad środowiskowy, nasilenie objawów w miejscu pracy oraz ich złagodzenie poza nim, najbardziej prawdopodobnym rozpoznaniem jest zespół chorego budynku (SBS – sick building syndrome).
         </p>
        
        <p className="text-sm mb-1">Uzasadnienie rozpoznania:</p>
        <p className="text-sm leading-relaxed mb-2">
          Dane wskazują, że pacjentka spełnia kryteria typowe dla SBS:<br />
          • początek i zaostrzenie objawów ściśle związane z przebywaniem w określonym pomieszczeniu biurowym,<br />
          • ustępowanie dolegliwości w czasie przerwy od pracy,<br />
          • objawy nieswoiste (podrażnienie spojówek, gardła i krtani, dysfonia), zgodne z charakterystyką SBS,<br />
          • brak dowodów klinicznych i badań wskazujących na inne przyczyny (alergia, infekcja, choroba zawodowa),<br />
          • podobne objawy zgłaszały również inne osoby pracujące w tym samym pomieszczeniu,<br />
          • w powietrzu stwierdzono obecność PCP w stężeniu przekraczającym normy dla środowiska komunalnego, co potwierdza ekspozycję na czynnik drażniący.
        </p>
        <p className="text-sm mb-1">Proponowane leczenie i postępowanie:</p>
        <div className="text-sm leading-relaxed">
          <p className="mb-0">• Usunięcie ekspozycji – zmiana stanowiska pracy lub poprawa warunków środowiskowych (wentylacja, usunięcie materiałów wydzielających PCP).</p>
          <p className="mb-0">• Leczenie objawowe – krople nawilżające do oczu, preparaty łagodzące podrażnienie gardła i krtani.</p>
          <p className="mb-0">• Monitorowanie – kontrola okulistyczna, laryngologiczna i foniatryczna w celu oceny dynamiki objawów.</p>
          <p className="mb-0">• Zgłoszenie do odpowiednich instytucji (np. Inspekcji Sanitarnej) w celu oceny środowiska pracy.</p>
        </div>
      </>
    );
  };

  if (chatStarted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do poprzedniej strony
            </Button>
            <Button variant="outline" onClick={handleFinishChat}>
              Zakończ rozmowę
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">{selectedBot?.name}</h1>
          <p className="text-center text-gray-500 mb-6">ID: {userId}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Opis przypadku</CardTitle>
                </CardHeader>
                <CardContent>
                  {getCaseDescription()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diagnoza i propozycja leczenia</CardTitle>
                </CardHeader>
                <CardContent>
                  {getDiagnosis()}
                </CardContent>
              </Card>
            </div>

             <div className="flex h-full">
                <ChatInterface
                 messages={messages}
                 onMessagesUpdate={setMessages}
                 chatbotPersonality={selectedBot?.personality || 'expert'}
                 onSendMessage={sendMessageToBackend}
               />
             </div>
          </div>
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
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Instrukcja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>W tym badaniu wykorzystane zostały trzy chatboty sztucznej inteligencji.</li>
                  <li>Każdy z nich otrzymał konkretny i realny przypadek medyczny.</li>
                  <li>Każdy z tych chatbotów, opartych na sztucznej inteligencji, zaproponował/wygenerował diagnozę oraz plan leczenia dla swojego przypadku medycznego.</li>
                  <li>Twoim zadaniem będzie ocena zaproponowanej przez sztuczną inteligencję diagnozy i planu leczenia pod względem wiarygodności/prawdziwości/trafności. W tym celu poprowadzisz rozmowę z każdym z chatbotów.</li>
                  <li>Możesz im na przykład zadawać pytania, prosić o analizę, wyjaśnienia (trudnych, nieznanych Ci) pojęć, dzielić się wątpliwościami. Wszystko co pomoże Ci w ocenie.</li>
                  <li>Po każdej rozmowie zostaną zadane Ci pytania o Twoje wrażenia i przemyślenia.</li>
                  <li>Co ważne - nie korzystaj z żadnych zewnętrznych źródeł informacji (np. wyszukiwarek internetowych, innych chatbotów sztucznej inteligencji, książek czy aplikacji medycznych). Liczy się wyłącznie Twoja samodzielna analiza w oparciu o rozmowę.</li>
                  <li>Każda rozmowa ma ograniczony czas - jeśli będzie się zbliżał do końca, zostaniesz o tym poinformowany.</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Wybór chatbota</CardTitle>
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
