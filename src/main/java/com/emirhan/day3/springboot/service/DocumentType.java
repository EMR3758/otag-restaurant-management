package com.emirhan.day3.springboot.service;

/**
 * OCR belgesinin genel yapısını ifade eder.
 * INVOICE: Elektrik, su, doğalgaz, GSM, internet, kira, vergi, abonelik gibi tek kalemlik
 *          fatura/hizmet belgeleri. Kategori belge bazında (tüm metinden) belirlenir.
 * ITEM_LIST: Restaurant adisyonu, market/manav fişi gibi birden fazla ürün satırı içeren
 *            belgeler. Kategori her ürün satırı için ayrı ayrı belirlenir.
 */
public enum DocumentType {
    INVOICE,
    ITEM_LIST
}
