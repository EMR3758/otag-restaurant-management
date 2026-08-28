import Layout from "../../components/Layout.jsx";
import KdsStationBoard from "../../components/KdsStationBoard.jsx";
import { KDS_STATIONS, KDS_STATUS } from "../../data/mockKdsOrders.js";

// Nargile ekranı diğer iki KDS'den daha sadedir: gecikme takibi, ürün notu
// ve "teslim edildi" durumu kullanılmaz (sadece Bekleyen/Hazırlanıyor/Hazır/İptal).
function Nargile() {

    return (
        <Layout navbarType="dashboard" title="Nargile">

            <KdsStationBoard
                station={KDS_STATIONS.NARGILE}
                finalStatus={KDS_STATUS.READY}
                showDelayed={false}
                showMix
                pageTitle="Nargile"
                pageSubtitle="Bugünün nargile operasyonu"
                emptyStateText="Şu anda hazırlanacak nargile siparişi bulunmuyor."
            />

        </Layout>
    );

}

export default Nargile;
