

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Interaktywne Badanie<br />Psychologiczne
          </h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                O badaniu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>W tym badaniu porozmawiasz z trzema różnymi chatbotami opartymi na sztucznej inteligencji.</p>
                
                <p>Każdy z nich będzie prowadził rozmowę w oparciu o inny przypadek medyczny oraz zaproponowaną przez siebie diagnozę i plan leczenia.</p>
                
                <p>Każdy przypadek został celowo skrócony do kluczowych informacji klinicznych - jego celem nie jest odtworzenie pełnej procedury diagnostycznej. Przedstawiona diagnoza została wygenerowana przez chatbota opartego na sztucznej inteligencji.</p>
                
                <p>Twoim zadaniem jest ocenić sposób rozumowania i trafność wniosków przedstawionych przez chatbota. </p>
                
                <p>Zastanów się nad diagnozą, analizuj ją i prowadź rozmowę - możesz zadawać pytania, komentować i dzielić się swoimi przemyśleniami.</p>
                
                <p>Nie korzystaj z żadnych zewnętrznych źródeł informacji (np. wyszukiwarek internetowych, innych chatbotów AI, książek czy aplikacji medycznych). Liczy się wyłącznie Twoja samodzielna analiza w oparciu o rozmowę.</p>
                
                <p>Każda rozmowa ma ograniczony czas - jeśli będzie się zbliżał do końca, zostaniesz o tym poinformowany/a.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
              <Button 
                onClick={() => navigate('/medical-chatbot')}
                className="w-full"
                size="lg"
              >
                Rozpocznij badanie
              </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
