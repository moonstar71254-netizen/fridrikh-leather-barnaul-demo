import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowUpRight, Menu, MessageCircle, Send, Star, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE_OUT = [0.23, 1, 0.32, 1];

const FALLBACK_CONFIG = {
  brandName: 'Кожевенная мастерская',
  brandFamily: 'Семьи Фридрих',
  shortBrand: 'Семья Фридрих',
  city: 'Барнаул',
  founders: 'Евгений и Ирина Фридрих',
  tagline: 'Изделия из натуральной кожи с ручным седельным швом, реставрация памятных вещей и корпоративные партии по договору.',
  address: 'Барнаул, ул. Гоголя, 213, офис 5, цокольный этаж',
  district: 'Центральный район, 656008',
  schedule: 'Ежедневно с 09:00',
  scheduleShort: 'С 09:00',
  ratingValue: '5.0',
  ratingMeta: '16 оценок · 12 отзывов на 2ГИС',
  priceUpdated: 'Прайс-лист обновлен 4 ноября 2026',
  contacts: {
    phoneDisplay: '+7 (913) 029-16-48',
    whatsappUrl: 'https://wa.me/79130291648',
    telegramUrl: 'https://t.me/+79130291648',
    gisUrl: 'https://2gis.ru/barnaul/firm/70000001084526676',
    vkUrl: 'https://vk.ru/kogevnik22'
  },
  images: {
    hero: './images/hero-stitch.svg',
    heroAlt: 'Натуральная кожа и ручной седельный шов',
    craft: './images/craft-tools.svg',
    craftAlt: 'Инструменты кожевника на верстаке',
    collection: './images/collection-bag.svg',
    collectionAlt: 'Кожаная мужская сумка и портмоне ручной работы',
    b2b: './images/b2b-cardholders.svg',
    b2bAlt: 'Партия кожаных картхолдеров ручной работы'
  },
  story: {
    eyebrow: 'Семейное дело в Барнауле',
    title: 'Кожа, которая стареет благородно',
    lead: 'В мастерской Евгения и Ирины Фридрих каждое изделие проходит через руки от раскроя шкуры до финишной полировки уреза.',
    body: 'Берёмся за штучные заказы с личной историей, бережно восстанавливаем памятные вещи и изготавливаем корпоративные партии по договору.',
    pillars: []
  },
  categories: [{ id: 'all', label: 'Все изделия' }],
  catalog: [],
  special: {
    b2bEyebrow: 'Корпоративным клиентам · B2B',
    b2bTitle: 'Корпоративные партии по договору',
    b2bMetric: '250',
    b2bMetricLabel: 'картхолдеров с индивидуальной гравировкой в одном заказе',
    b2bText: 'Корпоративные подарки из натуральной кожи с гравировкой по официальному договору.',
    restorationEyebrow: 'Бережное восстановление',
    restorationTitle: 'Реставрация памятных изделий',
    restorationText: 'Восстановление памятных кожаных сумок, портмоне и аксессуаров.'
  }
};

function buildWhatsappInquiry(baseUrl, itemTitle) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  const text = encodeURIComponent(`Здравствуйте! Интересует изделие: ${itemTitle}`);
  return `${baseUrl}${separator}text=${text}`;
}

export default function App() {
  const config = useMemo(() => {
    if (typeof window !== 'undefined' && window.SITE_CONFIG) {
      return { ...FALLBACK_CONFIG, ...window.SITE_CONFIG };
    }
    return FALLBACK_CONFIG;
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);

  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const lenisRef = useRef(null);

  const filteredCatalog = useMemo(() => {
    if (activeCategory === 'all') return config.catalog;
    return config.catalog.filter((item) => item.category === activeCategory);
  }, [activeCategory, config.catalog]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenisRef.current = lenis;

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true
            }
          });
        }

        gsap.to('.js-hero-parallax', {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.utils.toArray('.js-frame-parallax').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  const handleAnchorClick = (event, targetId) => {
    event.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(targetId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -72 });
    } else {
      el.scrollIntoView({ behavior: 'auto' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="page-shell">
        <div ref={progressRef} className="scroll-progress" aria-hidden="true" />

        <header className="site-header">
          <div className="container header-inner">
            <a
              href="#top"
              className="brand-mark"
              onClick={(e) => handleAnchorClick(e, '#top')}
            >
              <span className="brand-monogram">{config.shortBrand}</span>
              <span className="brand-city">{config.city}</span>
            </a>

            <nav className="desktop-nav" aria-label="Навигация по разделам">
              <a
                href="#craft"
                className="nav-link"
                onClick={(e) => handleAnchorClick(e, '#craft')}
              >
                Ремесло
              </a>
              <a
                href="#collection"
                className="nav-link"
                onClick={(e) => handleAnchorClick(e, '#collection')}
              >
                Изделия и цены
              </a>
              <a
                href="#b2b"
                className="nav-link"
                onClick={(e) => handleAnchorClick(e, '#b2b')}
              >
                B2B и реставрация
              </a>
              <a
                href="#contacts"
                className="nav-link"
                onClick={(e) => handleAnchorClick(e, '#contacts')}
              >
                Контакты
              </a>
            </nav>

            <a
              href={config.contacts.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="header-cta"
            >
              Написать
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>

            <button
              type="button"
              className="mobile-menu-btn"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-drawer"
              aria-label="Мобильное меню"
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              <a
                href="#craft"
                className="mobile-drawer-link"
                onClick={(e) => handleAnchorClick(e, '#craft')}
              >
                Ремесло
              </a>
              <a
                href="#collection"
                className="mobile-drawer-link"
                onClick={(e) => handleAnchorClick(e, '#collection')}
              >
                Изделия и цены
              </a>
              <a
                href="#b2b"
                className="mobile-drawer-link"
                onClick={(e) => handleAnchorClick(e, '#b2b')}
              >
                B2B и реставрация
              </a>
              <a
                href="#contacts"
                className="mobile-drawer-link"
                onClick={(e) => handleAnchorClick(e, '#contacts')}
              >
                Контакты
              </a>
              <div className="hero-actions">
                <a
                  href={config.contacts.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp
                </a>
                <a
                  href={config.contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Telegram
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        <main id="top">
          <section className="hero">
            <div className="hero-media">
              <img
                src={config.images.hero}
                alt={config.images.heroAlt}
                className="js-hero-parallax"
              />
            </div>
            <div className="hero-vignette" aria-hidden="true" />

            <div className="container hero-content">
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <span className="eyebrow">
                  {config.founders} · {config.city}
                </span>
                <h1 className="hero-title">
                  {config.brandName}
                  <em>{config.brandFamily}</em>
                </h1>
              </motion.div>

              <motion.div
                className="hero-bottom"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.08, ease: EASE_OUT }}
              >
                <div>
                  <p className="hero-lead">{config.tagline}</p>
                  <div className="hero-actions">
                    <a
                      href={config.contacts.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Обсудить заказ в WhatsApp
                    </a>
                    <a
                      href={config.contacts.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <Send size={15} aria-hidden="true" />
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="hero-meta-strip">
                <div>
                  <span className="meta-label">Мастерская</span>
                  <span className="meta-value">{config.address}</span>
                </div>
                <div>
                  <span className="meta-label">График работы</span>
                  <span className="meta-value">{config.scheduleShort} · {config.district}</span>
                </div>
                <div>
                  <span className="meta-label">Репутация</span>
                  <span className="meta-value">
                    {config.ratingValue} ★ · {config.ratingMeta}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section id="craft" className="section section-espresso">
            <div className="container craft-grid">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <span className="eyebrow">{config.story.eyebrow}</span>
                <h2 className="section-title">{config.story.title}</h2>
                <p className="section-lead">{config.story.lead}</p>
                <p className="section-body">{config.story.body}</p>

                <div className="pillars">
                  {config.story.pillars.map((pillar) => (
                    <div key={pillar.index} className="pillar-row">
                      <span className="pillar-num">{pillar.index}</span>
                      <div>
                        <h3 className="pillar-title">{pillar.title}</h3>
                        <p className="pillar-text">{pillar.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <figure className="frame-figure">
                <div className="media-frame">
                  <img
                    src={config.images.craft}
                    alt={config.images.craftAlt}
                    className="js-frame-parallax"
                    loading="lazy"
                  />
                </div>
                <figcaption className="frame-caption">
                  <span>Ручной инструмент и вощёная нить</span>
                  <span>Барнаул · Гоголя, 213</span>
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="collection" className="section">
            <div className="container">
              <div className="collection-header">
                <div>
                  <span className="eyebrow">Каталог и прайс-лист</span>
                  <h2 className="section-title">Изделия ручной работы</h2>
                </div>
                <div>
                  <p className="section-body">
                    Каждую модель можно адаптировать под нужный цвет кожи, оттенок нити и именное тиснение.
                  </p>
                  <p className="price-note">{config.priceUpdated}</p>
                </div>
              </div>

              <div className="collection-showcase">
                <figure className="frame-figure">
                  <div className="media-frame">
                    <img
                      src={config.images.collection}
                      alt={config.images.collectionAlt}
                      className="js-frame-parallax"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="frame-caption">
                    <span>Сумки и портмоне</span>
                    <span>Ручной шов</span>
                  </figcaption>
                </figure>

                <div>
                  <div className="filter-tabs" role="tablist" aria-label="Категории изделий">
                    {config.categories.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          data-active={isActive}
                          className="filter-tab"
                          onClick={() => setActiveCategory(cat.id)}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="active-category-pill"
                              className="filter-pill"
                              transition={{ duration: 0.26, ease: EASE_OUT }}
                            />
                          )}
                          <span className="filter-label">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="price-list">
                    <AnimatePresence mode="popLayout">
                      {filteredCatalog.map((item) => (
                        <motion.article
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.24, ease: EASE_OUT }}
                          className="price-item"
                        >
                          <div className="price-item-top">
                            <h3 className="price-item-title">{item.title}</h3>
                            <span className="price-item-value">{item.price}</span>
                          </div>
                          <p className="price-item-note">{item.note}</p>
                          <div className="price-item-actions">
                            <a
                              href={buildWhatsappInquiry(config.contacts.whatsappUrl, item.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost"
                            >
                              Заказать в WhatsApp
                              <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                            <a
                              href={config.contacts.telegramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost"
                            >
                              Спросить в Telegram
                            </a>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="b2b" className="section section-espresso">
            <div className="container b2b-grid">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <span className="eyebrow">{config.special.b2bEyebrow}</span>
                <h2 className="section-title">{config.special.b2bTitle}</h2>
                <p className="section-body">{config.special.b2bText}</p>

                <div className="metric-callout">
                  <span className="metric-number">{config.special.b2bMetric}</span>
                  <span className="metric-caption">{config.special.b2bMetricLabel}</span>
                </div>

                <div className="restoration-panel">
                  <span className="eyebrow">{config.special.restorationEyebrow}</span>
                  <h3 className="restoration-title">{config.special.restorationTitle}</h3>
                  <p className="section-body">{config.special.restorationText}</p>
                </div>
              </motion.div>

              <figure className="frame-figure">
                <div className="media-frame">
                  <img
                    src={config.images.b2b}
                    alt={config.images.b2bAlt}
                    className="js-frame-parallax"
                    loading="lazy"
                  />
                </div>
                <figcaption className="frame-caption">
                  <span>Корпоративные тиражи с гравировкой</span>
                  <span>Работа по договору</span>
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="reviews" className="section">
            <div className="container">
              <motion.div
                className="trust-panel"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div>
                  <span className="eyebrow">Оценка клиентов</span>
                  <p className="rating-big">{config.ratingValue}</p>
                  <div className="rating-stars" aria-label="Рейтинг 5 из 5">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Star key={idx} size={18} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="price-note">{config.ratingMeta}</p>
                </div>

                <div>
                  <h2 className="section-title">Реальные отзывы и живые работы</h2>
                  <p className="section-body">
                    Посмотреть готовые изделия Евгения и Ирины Фридрих, актуальные фото с верстака и прочитать все 12 отзывов клиентов можно напрямую в 2ГИС и в сообществе ВКонтакте.
                  </p>
                  <div className="trust-links">
                    <a
                      href={config.contacts.gisUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Открыть отзывы на 2ГИС
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                    <a
                      href={config.contacts.vkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Сообщество ВКонтакте
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="contacts" className="section section-espresso">
            <div className="container contacts-grid">
              <div>
                <span className="eyebrow">Визит и связь</span>
                <h2 className="section-title">Мастерская в центре Барнаула</h2>
                <p className="section-body">
                  Напишите нам в мессенджер, чтобы обсудить кожу, размеры, гравировку или договориться о встрече в мастерской.
                </p>

                <div className="contact-list">
                  <div className="contact-row">
                    <span className="contact-key">Адрес</span>
                    <span className="contact-val">
                      {config.address}
                      <br />
                      {config.district}
                    </span>
                  </div>
                  <div className="contact-row">
                    <span className="contact-key">График</span>
                    <span className="contact-val">{config.schedule}</span>
                  </div>
                  <div className="contact-row">
                    <span className="contact-key">Телефон</span>
                    <span className="contact-val">{config.contacts.phoneDisplay}</span>
                  </div>
                  <div className="contact-row">
                    <span className="contact-key">Мастера</span>
                    <span className="contact-val">{config.founders}</span>
                  </div>
                </div>
              </div>

              <motion.div
                className="contact-card"
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <span className="eyebrow">Прямой контакт</span>
                <h3 className="contact-card-title">Обсудить изделие или партию</h3>
                <p className="section-body">
                  Пришлите фото желаемой модели, вещи на реставрацию или задачу для корпоративного заказа — ответим лично.
                </p>

                <div className="contact-card-actions">
                  <a
                    href={config.contacts.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Написать в WhatsApp
                  </a>
                  <a
                    href={config.contacts.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <Send size={15} aria-hidden="true" />
                    Написать в Telegram
                  </a>
                  <a
                    href={config.contacts.gisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Построить маршрут в 2ГИС
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <span className="footer-wordmark">
              {config.brandName} {config.brandFamily}
            </span>
            <span className="footer-meta">
              {config.city} · {config.address}
            </span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
