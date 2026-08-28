package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.model.ExpenseCategory;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
public class ExpenseCategoryDetector {

    private static final Map<ExpenseCategory, List<String>> CATEGORY_KEYWORDS = new LinkedHashMap<>();

    static {
        CATEGORY_KEYWORDS.put(ExpenseCategory.RAW_MATERIAL, List.of(
                "MANAV", "KASAP", "SEBZE", "MEYVE", "ET", "TAVUK", "BALIK", "SUT", "PEYNIR",
                "UN", "YAG", "TEREYAGI", "ZEYTINYAGI", "BAHARAT", "YUMURTA", "PIRINC",
                "BAKLIYAT", "SOGAN", "DOMATES", "PATATES", "HAMMADDE", "GIDA TOPTANCISI"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.BEVERAGE, List.of(
                "KAHVE", "CAY", "KOLA", "COLA", "MESRUBAT", "ICECEK", "SU", "ENERJI ICECEGI",
                "MADEN SUYU", "MEYVE SUYU", "AYRAN", "GAZOZ"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.FOOD, List.of(
                "HAZIR YEMEK", "PAKETLI GIDA", "TATLI", "EKMEK", "PASTA", "UNLU MAMUL",
                "ATISTIRMALIK", "BISKUVI", "CIKOLATA", "GIDA URUNU", "CIPS",
                "PIDE", "PIDESI", "CORBA", "CORBASI", "KEBAP", "KEBABI", "GUVEC", "GUVECI",
                "PILAV", "PILAVI", "DONER", "KOFTE", "MANTI", "LAHMACUN", "IZGARA",
                "SALATA", "MAKARNA", "TOST", "MEZE"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.UTILITIES, List.of(
                "ELEKTRIK FATURASI", "DOGALGAZ FATURASI", "SU FATURASI", "ELEKTRIK",
                "DOGALGAZ", "ISKI", "ASKI", "TEDAS", "ENERJI FATURASI"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.CLEANING, List.of(
                "DETERJAN", "CAMASIR SUYU", "BULASIK", "TEMIZLIK", "DEZENFEKTAN",
                "HIJYEN", "PECETE", "KAGIT HAVLU", "TUVALET KAGIDI"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.EQUIPMENT, List.of(
                "KAHVE MAKINESI", "FIRIN", "BUZDOLABI", "BLENDER", "POS CIHAZI",
                "DEMIRBAS", "EKIPMAN", "MAKINE", "CIHAZ", "MASA", "SANDALYE"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.FUEL, List.of(
                "BENZIN", "MOTORIN", "DIZEL", "AKARYAKIT", "YAKIT", "LPG"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.RENT, List.of(
                "KIRA BEDELI", "ISYERI KIRASI", "KIRA ODEMESI", "KIRA"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.INTERNET, List.of(
                "INTERNET FATURASI", "FIBER INTERNET", "INTERNET", "FIBER", "ADSL", "MODEM"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.GSM, List.of(
                "GSM FATURASI", "MOBIL HAT", "CEP TELEFONU FATURASI", "MOBIL INTERNET", "GSM"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.PHONE, List.of(
                "SABIT TELEFON", "TELEFON FATURASI", "SANTRAL"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.SUBSCRIPTION, List.of(
                "ABONELIK", "UYELIK", "MAC YAYINI", "TV PAKETI", "DIJITAL YAYIN",
                "PLATFORM UYELIGI", "YAYIN PAKETI"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.SERVICE, List.of(
                "TEKNIK SERVIS", "BAKIM ONARIM", "MUHASEBE", "DANISMANLIK",
                "SERVIS HIZMETI", "TAMIR", "BAKIM"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.PERSONNEL, List.of(
                "PERSONEL MAASI", "SGK", "BORDRO", "PERSONEL YEMEGI", "PERSONEL YOL",
                "SIGORTA PRIMI", "PERSONEL", "MAAS"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.TAX, List.of(
                "VERGI DAIRESI", "GELIR VERGISI", "KDV ODEME", "BELEDIYE", "HARC", "MTV", "VERGI"
        ));
        CATEGORY_KEYWORDS.put(ExpenseCategory.MARKETING, List.of(
                "GOOGLE ADS", "META ADS", "INSTAGRAM REKLAM", "REKLAM", "BROSUR",
                "TABELA", "PROMOSYON", "PAZARLAMA"
        ));
    }

    private static final List<String> INVOICE_SIGNALS = List.of(
            "FATURA NO", "FATURA", "ABONE", "ELEKTRIK", "ISKI", "GSM", "INTERNET", "HIZMET"
    );

    private static final List<String> ITEM_LIST_SIGNALS = List.of(
            "ADET", "KG", "MASA", "KISIM", "ADISYON"
    );

    /**
     * Belgenin fatura/hizmet mi ("tek kategori tüm belgeye uygulanır") yoksa ürün
     * satırlarından oluşan bir fiş mi ("her satır kendi kategorisini alır") olduğunu tespit eder.
     */
    public DocumentType detectDocumentType(String ocrText) {
        if (ocrText == null || ocrText.isBlank()) {
            return DocumentType.ITEM_LIST;
        }

        String normalizedText = normalize(ocrText);

        int invoiceScore = scoreCategory(normalizedText, INVOICE_SIGNALS);
        int itemListScore = scoreCategory(normalizedText, ITEM_LIST_SIGNALS);

        return invoiceScore > itemListScore ? DocumentType.INVOICE : DocumentType.ITEM_LIST;
    }


    public String detectLineItemCategory(String lineText) {
        String category = detectCategory(lineText);

        if (ExpenseCategory.OTHER.name().equals(category)) {
            return ExpenseCategory.FOOD.name();
        }

        return category;
    }

    public String detectCategory(String ocrText) {
        if (ocrText == null || ocrText.isBlank()) {
            return ExpenseCategory.OTHER.name();
        }

        String normalizedText = normalize(ocrText);

        ExpenseCategory bestCategory = ExpenseCategory.OTHER;
        int bestScore = 0;
        boolean ambiguous = false;

        for (Map.Entry<ExpenseCategory, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            int score = scoreCategory(normalizedText, entry.getValue());

            if (score > bestScore) {
                bestScore = score;
                bestCategory = entry.getKey();
                ambiguous = false;
            } else if (score == bestScore && score > 0) {
                ambiguous = true;
            }
        }

        if (bestScore == 0 || ambiguous) {
            return ExpenseCategory.OTHER.name();
        }

        return bestCategory.name();
    }

    private int scoreCategory(String normalizedText, List<String> keywords) {
        int score = 0;

        for (String keyword : keywords) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(keyword) + "\\b");
            Matcher matcher = pattern.matcher(normalizedText);

            int weight = keyword.contains(" ") ? 2 : 1;

            while (matcher.find()) {
                score += weight;
            }
        }

        return score;
    }
    private String normalize(String text) {
        String upper = text.toUpperCase(new Locale("tr", "TR"));

        StringBuilder sb = new StringBuilder(upper.length());
        for (char c : upper.toCharArray()) {
            switch (c) {
                case 'İ' -> sb.append('I');
                case 'Ş' -> sb.append('S');
                case 'Ğ' -> sb.append('G');
                case 'Ç' -> sb.append('C');
                case 'Ö' -> sb.append('O');
                case 'Ü' -> sb.append('U');
                default -> sb.append(c);
            }
        }

        return sb.toString().replaceAll("[\\r\\n]+", " ").replaceAll("\\s+", " ").trim();
    }
}
