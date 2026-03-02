# Disler Multi-Agent Port Rehberi (pi-vs-claude-code -> pi-mono)

Bu dokuman, Disler tarafindaki extension tabanli multi-agent isletim katmanini bu repoda nasil calistiracagini adim adim anlatir.

## 1) Net Durum

- Evet, Disler'in multi-agent mimarisi portlandi.
- Port extension tabanlidir.
- `packages/coding-agent` cekirdegi degistirilmedi.
- Mimari dosyalari `extensions/` ve `.pi/` altinda calisir.

## 2) Portlanan Bilesenler

- `extensions/` altina 16 dosya birebir tasindi:
  - `agent-team.ts`
  - `agent-chain.ts`
  - `subagent-widget.ts`
  - `pi-pi.ts`
  - `damage-control.ts`
  - `system-select.ts`
  - `theme-cycler.ts`
  - `minimal.ts`
  - `pure-focus.ts`
  - `cross-agent.ts`
  - `purpose-gate.ts`
  - `tool-counter.ts`
  - `tool-counter-widget.ts`
  - `session-replay.ts`
  - `tilldone.ts`
  - `themeMap.ts`
- Ajan ve workflow tanimlari:
  - `.pi/agents/*.md`
  - `.pi/agents/teams.yaml`
  - `.pi/agents/agent-chain.yaml`
  - `.pi/agents/pi-pi/*`
- Guvenlik:
  - `.pi/damage-control-rules.yaml`
- Tema:
  - `.pi/themes/*.json`
- Skill:
  - `.pi/skills/bowser.md`
- Proje ayari:
  - `.pi/settings.json`

## 3) Mimari Katmanlar

- Orkestrasyon:
  - `agent-team.ts` (dispatcher + team secimi)
  - `agent-chain.ts` (sirali zincir pipeline)
  - `subagent-widget.ts` (arkaplan sub-agent)
  - `pi-pi.ts` (uzmanlari paralel sorgulayan meta-agent)
- Kontrol ve guvenlik:
  - `damage-control.ts`
  - `system-select.ts`
  - `cross-agent.ts`
  - `purpose-gate.ts`
  - `tilldone.ts`
- Gozlemlenebilirlik ve UI:
  - `minimal.ts`
  - `pure-focus.ts`
  - `theme-cycler.ts`
  - `tool-counter.ts`
  - `tool-counter-widget.ts`
  - `session-replay.ts`
  - `themeMap.ts`

## 4) On Kosullar

1. `pi` komutu PATH'te olmali.
2. Komutlari repo kokunden (`c:\\dev\\pi-mono`) calistir.
3. Extension veya `.pi` dosyalarini degistirdikten sonra `pi` icinde `/reload` kullan.
4. `subagent/team/chain/pi-pi` extensionlari icte `spawn("pi", ...)` kullandigi icin `pi` binary'sine ulasilabilir olmasi zorunlu.

Kontrol:

```bash
pi --version
```

## 5) Calistirma Profilleri (Disler Tarzi)

Asagidaki komutlari aynen kullanabilirsin:

```bash
# 1) Varsayilan pi
pi

# 2) Pure focus
pi -e extensions/pure-focus.ts

# 3) Minimal + tema degistirici
pi -e extensions/minimal.ts -e extensions/theme-cycler.ts

# 4) Cross-agent entegrasyon
pi -e extensions/cross-agent.ts -e extensions/minimal.ts

# 5) Purpose gate
pi -e extensions/purpose-gate.ts -e extensions/minimal.ts

# 6) Tool counter footer
pi -e extensions/tool-counter.ts

# 7) Tool counter widget
pi -e extensions/tool-counter-widget.ts -e extensions/minimal.ts

# 8) Subagent widget
pi -e extensions/subagent-widget.ts -e extensions/pure-focus.ts -e extensions/theme-cycler.ts

# 9) TillDone
pi -e extensions/tilldone.ts -e extensions/theme-cycler.ts

# 10) Agent team
pi -e extensions/agent-team.ts -e extensions/theme-cycler.ts

# 11) System select
pi -e extensions/system-select.ts -e extensions/minimal.ts -e extensions/theme-cycler.ts

# 12) Damage control
pi -e extensions/damage-control.ts -e extensions/minimal.ts -e extensions/theme-cycler.ts

# 13) Agent chain
pi -e extensions/agent-chain.ts -e extensions/theme-cycler.ts

# 14) Pi-Pi meta-agent
pi -e extensions/pi-pi.ts -e extensions/theme-cycler.ts

# 15) Session replay
pi -e extensions/session-replay.ts -e extensions/minimal.ts

# 16) Sadece tema secici
pi -e extensions/theme-cycler.ts -e extensions/minimal.ts
```

## 6) Slash Komut Envanteri

- `agent-team.ts`
  - `/agents-team` -> aktif team sec
  - `/agents-list` -> ajan durumlarini listele
  - `/agents-grid <1-6>` -> grid satir yuksekligi
- `agent-chain.ts`
  - `/chain` -> aktif chain sec
  - `/chain-list` -> chain listesini goster
- `subagent-widget.ts`
  - `/sub <gorev>` -> yeni sub-agent baslat
  - `/subcont <numara> <prompt>` -> mevcut sub-agent devam ettir
  - `/subrm <numara>` -> sub-agent sil
  - `/subclear` -> tum sub-agent'lari temizle
- `pi-pi.ts`
  - `/experts` -> uzmanlari listele
  - `/experts-grid <1-5>` -> uzman widget grid satir yuksekligi
- `system-select.ts`
  - `/system` -> sistem prompt/persona sec
- `theme-cycler.ts`
  - `/theme`
  - `/theme <tema-adi>`
- `tilldone.ts`
  - `/tilldone` -> mevcut branch task listesini gor
- `session-replay.ts`
  - `/replay` -> session timeline overlay
- `cross-agent.ts`
  - Dinamik komut kaydi yapar: `.claude/commands/*.md`, `.gemini/commands/*.md`, `.codex/commands/*.md` dosyalarini `/<dosya-adi>` olarak yukler.

## 7) Klavye Kisayollari

- `theme-cycler.ts`
  - `Ctrl+X` -> bir sonraki tema
  - `Ctrl+Q` -> bir onceki tema
- `session-replay.ts` overlay icinde
  - `Up/Down` -> gezinme
  - `Enter` -> secim
  - `Esc` -> cikis

## 8) Modelin Cagirabildigi Tool'lar

Bunlar slash komut degil, modelin tool-call olarak kullanabildigi extension API'leridir:

- `subagent-widget.ts`
  - `subagent_create`
  - `subagent_continue`
  - `subagent_remove`
  - `subagent_list`
- `agent-team.ts`
  - `dispatch_agent`
- `agent-chain.ts`
  - `run_chain`
- `pi-pi.ts`
  - `query_experts`
- `tilldone.ts`
  - `tilldone`

## 9) Konfigurasyon Dosyalari ve Ne Ise Yarar

- `.pi/agents/*.md`
  - Ajan rolleri, sistem promptlari ve tool kisitlari.
- `.pi/agents/teams.yaml`
  - Team tanimlari.
  - Varsayilan team'ler: `full`, `plan-build`, `info`, `frontend`, `pi-pi`.
- `.pi/agents/agent-chain.yaml`
  - Zincir adimlari.
  - Varsayilan chain'ler: `plan-build-review`, `plan-build`, `scout-flow`, `plan-review-plan`, `full-review`.
- `.pi/agents/pi-pi/pi-orchestrator.md`
  - Pi-Pi meta-agent ana orkestrator promptu.
- `.pi/damage-control-rules.yaml`
  - Riskli komut/path kurallari.
- `.pi/themes/*.json`
  - Tema tanimlari.
- `.pi/settings.json`
  - Varsayilan tema vb proje ayarlari.

## 10) Session ve Durum Davranisi

- `agent-team.ts` ve `agent-chain.ts`:
  - Session dosyalari proje icinde tutulur: `.pi/agent-sessions/*.json`.
  - Baslangicta eski team/chain session dosyalari temizlenir.
- `subagent-widget.ts`:
  - Session dosyalari kullanici home altinda tutulur: `~/.pi/agent/sessions/subagents`.
  - `/subcont` ayni session dosyasini kullanarak devam eder.
- `pi-pi.ts`:
  - Uzmanlari `--no-session` ile calistirir (kalici expert session tutmaz).

## 11) Ornek Is Akislari

1. Team orkestrasyonu:
  - `pi -e extensions/agent-team.ts -e extensions/theme-cycler.ts`
  - `/agents-team` ile team sec.
  - Gorevi yaz. Model `dispatch_agent` ile uygun uzmana dagitir.
2. Chain pipeline:
  - `pi -e extensions/agent-chain.ts -e extensions/theme-cycler.ts`
  - `/chain` ile zincir sec.
  - Gorevi ver. Model `run_chain` ile adimlari sirali calistirir.
3. Sub-agent:
  - `pi -e extensions/subagent-widget.ts -e extensions/pure-focus.ts -e extensions/theme-cycler.ts`
  - `/sub <gorev>` ile baslat, `/subcont` ile devam ettir.
4. Guvenlikli calisma:
  - `pi -e extensions/damage-control.ts -e extensions/minimal.ts -e extensions/theme-cycler.ts`
  - Riskli komutlar/patlar `damage-control-rules.yaml` kurallarina gore denetlenir.
5. Meta-agent:
  - `pi -e extensions/pi-pi.ts -e extensions/theme-cycler.ts`
  - Pi extension gelistirme gorevi ver, gerekirse `/experts` ile uzmanlari gor.

## 12) Sik Karsilasilan Sorunlar

- `No teams defined in .pi/agents/teams.yaml`
  - `teams.yaml` bos/hatali veya path yanlis.
- `No chains defined in .pi/agents/agent-chain.yaml`
  - `agent-chain.yaml` bos/hatali.
- `No experts found`
  - `.pi/agents/pi-pi/*.md` dosyalari eksik.
- Komutlar gorunmuyor
  - Ilgili extension yuklenmemis olabilir.
  - `/reload` calistir.
- `spawn pi ENOENT` veya benzeri
  - `pi` komutu PATH'te degil.

## 13) Bilincli Port Sinirlari

- Bu port "isletim katmani" odakli yapildi.
- `.claude/commands` entegrasyonu opsiyonel bir katmandir; bu repoda zorunlu degildir.
- Sende daha once var olan `.pi/extensions/*`, `.pi/prompts/*` gibi proje dosyalari korunmustur.

## 14) Hangi Dosyalari Ozellestirmelisin?

1. Team yapin icin:
  - `.pi/agents/teams.yaml`
2. Workflow zincirlerin icin:
  - `.pi/agents/agent-chain.yaml`
3. Roller ve uzman promptlari icin:
  - `.pi/agents/*.md`
  - `.pi/agents/pi-pi/*.md`
4. Guvenlik politikasi icin:
  - `.pi/damage-control-rules.yaml`
