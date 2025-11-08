'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, TrendingUp, DollarSign, Shield, MapPin, Building2 } from 'lucide-react';

const WhyAltai = () => {
  const reasons = [
    {
      icon: Mountain,
      title: "Русская Швейцария",
      description: "Горные хребты, чистейшие озера, целебные источники и нетронутая природа делают Алтай особенным местом на планете."
    },
    {
      icon: TrendingUp,
      title: "Растущий туризм",
      description: "Ежегодно туристический поток увеличивается на 25%, создавая устойчивый спрос на недвижимость и инфраструктуру."
    },
    {
      icon: Building2,
      title: "Развивающаяся инфраструктура",
      description: "Строится международный аэропорт, элитные апартаменты и коттеджи, лыжные трассы, гольф поле, игорная зона, и др. проекты"
    },
    {
      icon: DollarSign,
      title: "Высокая доходность",
      description: "Инвестиции в алтайскую недвижимость приносят от 30% годовых, что значительно выше среднероссийских показателей."
    },
    {
      icon: Shield,
      title: "Государственная поддержка",
      description: "Республика Алтай предоставляет налоговые льготы и упрощенные процедуры для инвесторов в туристической сфере."
    },
    {
      icon: MapPin,
      title: "Стратегическое расположение",
      description: "Удобная транспортная доступность из крупных городов Сибири и близость к границам с Монголией и Китаем."
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative">
      {/* Градиентный переход от Hero к WhyAltai */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A192F] via-[#0A192F]/80 to-white"></div>
      
      <div className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок секции */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl text-[#0A192F] mb-6">
                Время для инвестиций в{' '}
                <span className="text-[#00B4D8]">
                  Алтай
                </span>
              </h2>
              <p className="text-[18px] text-[#0A192F] max-w-5xl mx-auto leading-relaxed">
                2024-2025 год открыл уникальные возможности для перспективных финансовых вложений в земли Алтая.
              </p>
            </motion.div>

            {/* Сетка причин */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative h-full"
                >
                  <div className="bg-[#0A192F] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                    {/* Иконка */}
                    <div className="w-16 h-16 rounded-2xl bg-[#00B4D8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <reason.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Заголовок */}
                    <h3 className="text-xl font-bold text-white mb-4">
                      {reason.title}
                    </h3>
                    
                    {/* Описание */}
                    <p className="text-gray-300 leading-relaxed flex-grow">
                      {reason.description}
                    </p>
                    
                    {/* Декоративная линия */}
                    <div className="w-12 h-1 bg-[#00B4D8] rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAltai;
