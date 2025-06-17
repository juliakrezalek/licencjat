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
                <p>Celem badania jest zrozumienie, w jaki sposób użytkownicy oceniają diagnozy medyczne generowane przez chatboty sztucznej inteligencji, posługujące się różnymi stylami komunikacji.</p>
                
                <p>Badanie jest realizowane w ramach pracy licencjackiej na kierunku Psychologia i Informatyka na Uniwersytecie SWPS.<br />
                Autorka: Julia Krężałek • Promotor: dr Maksymilian Bielecki</p>
                
                <p>Badanie składa się z następujących etapów:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>wyrażenie zgody na udział w badaniu,</li>
                  <li>krótka rozmowa wprowadzająca (przedstawienie się oraz ogólne pytania dotyczące sztucznej inteligencji i chatbotów),</li>
                  <li>rozmowa z pierwszym chatbotem oraz wywiad pogłębiony,</li>
                  <li>rozmowa z drugim chatbotem oraz wywiad pogłębiony,</li>
                  <li>rozmowa z trzecim chatbotem oraz wywiad pogłębiony,</li>
                  <li>rozmowa podsumowująca (wrażenia ogólne).</li>
                </ul>
                
                <p>Całość zajmuje około 60 minut. Udział w badaniu jest dobrowolny i anonimowy - możesz je przerwać w dowolnym momencie, bez podawania przyczyny.</p>
                
                <p>Zebrane dane zostaną wykorzystane wyłącznie w celach naukowych, w ramach pracy licencjackiej. Badanie nie zbiera żadnych danych technicznych o Twoim urządzeniu ani przeglądarce.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                Instrukcje
              </CardTitle>
              <CardDescription className="text-center">
                Jak prawidłowo uczestniczyć w badaniu?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Podaj unikalny identyfikator</p>
                <p>• Wybierz wersję chatbota</p>
                <p>• Prowadź naturalną rozmowę</p>
                <p>• Zakończ używając przycisku</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                Badanie główne
              </CardTitle>
              <CardDescription className="text-center">
                Rozpocznij sesję badawczą z różnymi wariantami chatbotów medycznych
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/medical-chatbot')}
                className="w-full"
                size="lg"
              >
                Rozpocznij badanie
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
