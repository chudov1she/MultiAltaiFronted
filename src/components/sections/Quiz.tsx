'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, HelpCircle, Phone, Navigation, CheckCircle } from 'lucide-react';
import { Quiz as QuizType } from '@/types/quiz';
import { submitApplication, ApplicationRequestBody } from '@/lib/api/requests';

interface QuizProps {
  quizData: QuizType | null;
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [userData, setUserData] = useState({ name: '', phone: '', email: '' });
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [direction, setDirection] = useState(0);

  const questions = quizData?.questions || [];
  const totalSteps = questions.length + 2;

  // Проверяем, можно ли перейти к следующему шагу
  const canProceedToNext = () => {
    if (step <= questions.length) {
      return answers[step] !== undefined;
    }
    return true;
  };

  // Проверяем, можно ли вернуться назад
  const canGoBack = () => {
    if (step === 1) return false;
    if (step === questions.length + 1) return true; // Можно вернуться с контактов
    if (step === totalSteps) return true; // Можно вернуться с финального экрана
    return true;
  };

  // Анимации в стиле WhyInvest
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      y: 100, 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      y: 80, 
      opacity: 0, 
      scale: 0.9,
      rotateY: -15,
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const questionVariants = {
    hidden: { 
      x: direction > 0 ? 100 : -100, 
      opacity: 0, 
      scale: 0.95,
    },
    visible: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
    exit: { 
      x: direction > 0 ? -100 : 100, 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Автоматически переходим к следующему вопросу через небольшую задержку
    setTimeout(() => {
      if (step < questions.length) {
        paginate(1);
      }
    }, 300);
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
        setStatus('idle');
        setStatusMessage('');
    }
  };

  const paginate = (newDirection: number) => {
    // Проверяем возможность навигации
    if (newDirection > 0 && !canProceedToNext()) {
      return; // Нельзя идти вперед без ответа
    }
    if (newDirection < 0 && !canGoBack()) {
      return; // Нельзя идти назад
    }

    setDirection(newDirection);
    setStep((prev) => prev + newDirection);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userData.name || !userData.phone || !userData.email) {
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните все контактные поля.');
        return;
    }
    if (!quizData) {
        setStatus('error');
        setStatusMessage('Ошибка: данные квиза отсутствуют.');
        return;
    }

    setStatus('loading');
    setStatusMessage('');
    
    const requestData: ApplicationRequestBody = {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        quiz_answers: JSON.stringify(answers),
        request_type: 'quiz',
        status: 'new',
        related_object_content_type_app_label: 'quizzes',
        related_object_model_name: 'quiz',
        related_object_id: quizData.id,
    };

    try {
        await submitApplication(requestData);
        setStatus('success');
        setUserData({ name: '', phone: '', email: '' });
        setAnswers({});
        setDirection(1);
        setStep(totalSteps);
    } catch (error) {
        console.error("Quiz submission error:", error);
        setStatus('error');
        setStatusMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
    } 
  };

  const currentQuestion = questions[step - 1];
  const isContactStep = step === questions.length + 1;
  const isThankYouStep = step === totalSteps;

  if (!quizData) {
    return null; 
  }

  return (
    <section className="min-h-screen w-full">
      <motion.div 
        className="min-h-screen w-full bg-gray-50 max-w-[2100px] mx-auto my-15"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="pt-8 m-6 px-0 sm:px-21 pb-10 z-10">
          {/* Заголовок секции */}
          {!isThankYouStep && (
            <motion.div 
              className="
                mb-10
                text-start
                sm:mb-8 sm:text-center
                md:mb-16 md:text-left
                lg:mb-20 lg:text-left
                xl:mb-24 xl:text-left
              "
              variants={titleVariants}
            >
              <h2 className="
                text-2xl
                sm:text-3xl
                md:text-5xl
                lg:text-6xl
                xl:text-7xl
                font-bold
                text-center
                sm:text-center
                md:text-left
                text-[#011315]
              ">
                {quizData.title || "4 вопроса для бесплатной консультации"}
              </h2>
              {quizData.description && (
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mt-4 max-w-full sm:max-w-2xl md:max-w-4xl mx-auto md:mx-0 text-center sm:text-center md:text-left">
                  {quizData.description}
                </p>
              )}
            </motion.div>
          )}

          {/* Мобильный прогресс-бар (только для мобильных) */}
          <div className="block lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Вопрос {step} из {questions.length}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: questions.length }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step === i + 1 
                        ? 'bg-[#0095c6]' 
                        : step > i + 1 
                          ? 'bg-[#0095c6]/50' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Левая колонка - вопросы */}
            <div className="lg:col-span-2">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {!isContactStep && !isThankYouStep && currentQuestion && (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={questionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-[400px] flex flex-col justify-center"
                  >
                    <motion.div 
                      className="rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg bg-white"
                      variants={cardVariants}
                    >
                      {/* Фоновое изображение */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                        style={{
                          backgroundImage: 'url(/images/landscape.jpg)'
                        }}
                      ></div>

                      <motion.div 
                        className="relative z-10"
                        variants={textVariants}
                      >
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-gray-800 text-center sm:text-center md:text-left">
                          {currentQuestion.text}
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {currentQuestion.answers.map((answer) => (
                            <motion.button
                              key={answer.id}
                              onClick={() => handleAnswerChange(currentQuestion.id, answer.text)}
                              className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                                answers[currentQuestion.id] === answer.text
                                  ? 'bg-[#0095c6] border-[#0095c6] text-white shadow-lg scale-[1.02]'
                                  : 'bg-white/90 border-gray-200 hover:bg-[#0095c6]/10 hover:border-[#0095c6]/30 text-gray-700 hover:text-gray-900'
                              } text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-medium`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {answer.text}
                            </motion.button>
                          ))}
                        </div>

                        {/* Мобильные кнопки навигации (только если ответ выбран) */}
                        <div className="block lg:hidden mt-6">
                          {answers[currentQuestion.id] && (
                            <div className="flex space-x-3">
                              {/* Кнопка "Назад" (если можно) */}
                              {step > 1 && (
                                <motion.button
                                  onClick={() => paginate(-1)}
                                  className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition-colors"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <ChevronLeft className="w-4 h-4 mr-1" />
                                  Назад
                                </motion.button>
                              )}
                              
                              {/* Кнопка "Далее" */}
                              <motion.button
                                onClick={() => paginate(1)}
                                className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-[#0095c6] hover:bg-[#007a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition duration-150 ease-in-out ${
                                  step > 1 ? 'flex-1' : 'w-full'
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                Далее
                                <ChevronRight className="w-5 h-5 ml-2" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Шаг с контактами */}
                {isContactStep && (
                  <motion.div
                    key="contact"
                    custom={direction}
                    variants={questionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-[400px] flex flex-col justify-center"
                  >
                    <motion.div 
                      className="rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg bg-white"
                      variants={cardVariants}
                    >
                      {/* Фоновое изображение */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                        style={{
                          backgroundImage: 'url(/images/govsupport.jpg)'
                        }}
                      ></div>
                      
                                             {/* Иконка контактов */}
                       <motion.div 
                         className="absolute top-6 right-6 w-12 h-12 bg-[#0095c6] rounded-full flex items-center justify-center shadow-md"
                         variants={iconVariants}
                       >
                         <Phone className="w-6 h-6 text-white" />
                       </motion.div>
                       
                       <motion.div 
                         className="relative z-10"
                         variants={textVariants}
                       >
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-gray-800 text-center sm:text-center md:text-left">
                          Почти готово! Оставьте контакты для связи
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <input 
                              type="text" 
                              name="name" 
                              required 
                              value={userData.name} 
                              onChange={handleUserDataChange} 
                              disabled={status === 'loading' || status === 'success'} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] text-base sm:text-lg md:text-xl transition-colors" 
                              placeholder="Ваше имя"
                            />
                          </div>
                          <div>
                            <input 
                              type="tel" 
                              name="phone" 
                              required 
                              value={userData.phone} 
                              onChange={handleUserDataChange} 
                              disabled={status === 'loading' || status === 'success'} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] text-base sm:text-lg md:text-xl transition-colors" 
                              placeholder="Номер телефона"
                            />
                          </div>
                          <div>
                            <input 
                              type="email" 
                              name="email" 
                              required 
                              value={userData.email} 
                              onChange={handleUserDataChange} 
                              disabled={status === 'loading' || status === 'success'} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] text-base sm:text-lg md:text-xl transition-colors" 
                              placeholder="Email"
                            />
                          </div>
                          <button 
                            type="submit" 
                            disabled={status === 'loading' || status === 'success'} 
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base sm:text-lg md:text-xl font-medium rounded-lg shadow-sm text-white bg-[#0095c6] hover:bg-[#007a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {status === 'success' ? 'Заявка отправлена!' : 'Получить консультацию'}
                          </button>
                          {status === 'error' && (
                            <p className="mt-3 text-sm sm:text-base md:text-lg text-red-600 flex items-center justify-center">
                              <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
                            </p>
                          )}
                        </form>

                        {/* Мобильная кнопка "Назад" */}
                        <div className="block lg:hidden mt-4">
                          <button 
                            onClick={() => paginate(-1)}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Назад к вопросам
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Шаг "Спасибо" */}
                {isThankYouStep && (
                  <motion.div
                    key="thankyou"
                    custom={direction}
                    variants={questionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-h-[400px] flex flex-col justify-center"
                  >
                    <motion.div 
                      className="rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center shadow-lg bg-white text-center"
                      variants={cardVariants}
                    >
                      {/* Фоновое изображение */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                        style={{
                          backgroundImage: 'url(/images/katun.jpg)'
                        }}
                      ></div>
                      
                      <motion.div 
                        className="relative z-10"
                        variants={textVariants}
                      >
                        <CheckCircleIcon className="w-16 h-16 text-[#0095c6] mx-auto mb-6" />
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-gray-800 text-center">
                          Спасибо за ваши ответы!
                        </h3>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-md mx-auto">
                          Ваша заявка принята. Наш специалист скоро свяжется с вами для бесплатной консультации.
                        </p>

                        {/* Мобильная кнопка "Назад" */}
                        <div className="block lg:hidden mt-6">
                          <button 
                            onClick={() => paginate(-1)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Вернуться к контактам
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Правая колонка - навигация и информация (только для десктопа) */}
            <div className="hidden lg:block lg:col-span-1">
              <motion.div 
                className="rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-lg min-h-[400px] bg-white"
                variants={cardVariants}
              >
                {/* Фоновое изображение */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                  style={{
                    backgroundImage: 'url(/images/pattern-topo.svg)'
                  }}
                ></div>
                
                {/* Верхняя секция - навигация */}
                <motion.div 
                  className="mb-8 relative z-10"
                  variants={textVariants}
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-gray-800">
                    Навигация по квизу
                  </h3>
                  <div className="space-y-3">
                    {Array.from({ length: questions.length }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                          step === i + 1 
                            ? 'bg-[#0095c6] text-white' 
                            : step > i + 1 
                              ? 'bg-[#0095c6]/10 text-[#0095c6]' 
                              : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm sm:text-base md:text-lg font-medium mr-3">
                          {i + 1}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg">
                          {step > i + 1 ? '✓ Завершено' : `Вопрос ${i + 1}`}
                        </span>
                      </div>
                    ))}
                    <div
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        isContactStep 
                          ? 'bg-[#0095c6] text-white' 
                          : step > questions.length 
                            ? 'bg-[#0095c6]/10 text-[#0095c6]' 
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm sm:text-base md:text-lg font-medium mr-3">
                        <Phone className="w-4 h-4" />
                      </span>
                      <span className="text-sm sm:text-base md:text-lg">
                        {step > questions.length ? '✓ Завершено' : 'Контактные данные'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Нижняя секция - кнопки навигации */}
                <motion.div 
                  className="relative z-10"
                  variants={textVariants}
                >
                  <div className="flex space-x-3">
                    {canGoBack() && (
                      <button 
                        onClick={() => paginate(-1)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm sm:text-base md:text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Назад
                      </button>
                    )}
                    {step < totalSteps && !isContactStep && canProceedToNext() && (
                      <button 
                        onClick={() => paginate(1)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm sm:text-base md:text-lg font-medium rounded-lg text-white bg-[#0095c6] hover:bg-[#007a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition-colors"
                      >
                        Далее
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Quiz; 