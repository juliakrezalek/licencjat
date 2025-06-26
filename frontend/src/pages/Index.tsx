

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
                <p>Tematem badania jest zrozumienie, jak użytkownicy odbierają diagnozy medyczne udzielane przez sztuczną inteligencję.</p>
                
                <p>Badanie realizowane jest w ramach pracy licencjackiej autorstwa Julii Krężałek, studentki kierunku Psychologia i Informatyka na Uniwersytecie SWPS, pod opieką dra Maksymiliana Bieleckiego.</p>
                
                <p>Badanie rozpocznie się krótką rozmową wprowadzającą, po której uczestnik porozmawia z trzema różnymi chatbotami opartymi na sztucznej inteligencji. Każdej rozmowie towarzyszyć będzie krótki wywiad. Całość zakończy rozmowa podsumowująca, dotycząca ogólnych wrażeń z udziału w badaniu.</p>
                
                <p>Badanie potrwa nie dłużej niż godzinę.</p>
                
                <p>Udział w badaniu jest dobrowolny i anonimowy – można zrezygnować na każdym etapie, bez podawania przyczyny.</p>
                
                <p>Cały przebieg badania będzie rejestrowany, aby umożliwić późniejszą analizę wypowiedzi. Zebrane dane zostaną wykorzystane wyłącznie w celach naukowych, w ramach pracy licencjackiej. Badanie nie gromadzi żadnych danych technicznych z urządzenia ani przeglądarki uczestnika.</p>
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

