document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/customer-data", { method: "POST" });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        document.getElementById("totalTransactions").innerText = data.totalTransactions;
        document.getElementById("totalProfit").innerText = `R${data.totalProfit.toLocaleString()}`;
        document.getElementById("totalNullValues").innerText = data.totalNullValues;
        document.getElementById("capturedTransactions").innerText = data.capturedTransactions;

        renderBarChart(data.topCategories);
        renderAreaChart(data.topSpenders);

    } catch (error) {
        console.error("Failed to load customer insights:", error);
    }
});

function renderBarChart(categories) {
    const options = {
        series: [{ name: "Purchases", data: categories.map(c => c.count) }],
        chart: {
            type: 'bar',
            background: 'transparent',
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#2962ff', '#d50000', '#2e7d32', '#ff6d00', '#583cb3'], // Same colors as Code 1
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 4,
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: { enabled: false },
        fill: { opacity: 1 },
        grid: {
            borderColor: '#55596e',
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: true } },
        },
        legend: {
            labels: { colors: '#f5f7ff' },
            show: true,
            position: 'top',
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 2,
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
        },
        xaxis: {
            categories: categories.map(c => c.category),
            title: { style: { color: '#f5f7ff' } },
            axisBorder: { show: true, color: '#55596e' },
            axisTicks: { show: true, color: '#55596e' },
            labels: { style: { colors: '#f5f7ff' } },
        },
        yaxis: {
            title: { text: 'Count', style: { color: '#f5f7ff' } },
            axisBorder: { color: '#55596e', show: true },
            axisTicks: { color: '#55596e', show: true },
            labels: { style: { colors: '#f5f7ff' } },
        },
    };

    new ApexCharts(document.querySelector("#bar-chart"), options).render();
}

function renderAreaChart(spenders) {
    const options = {
        series: [{ name: "Amount", data: spenders.map(s => s.amount) }],
        chart: {
            type: 'area',
            background: 'transparent',
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#00ab57', '#d50000'], 
        dataLabels: {
            enabled: true,
            style: { colors: ['#f5f7ff'] },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.2,
                stops: [20, 100],
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
            y: {
                formatter: function(value) {
                    return 'R' + value.toLocaleString();
                },
            },
        },
        legend: {
            labels: { colors: '#f5f7ff' },
            show: true,
            position: 'top',
        },
        xaxis: {
            categories: spenders.map(s => `Customer ${s.customerId}`),
            title: { style: { color: '#f5f7ff' } },
            axisBorder: { show: true, color: '#55596e' },
            axisTicks: { show: true, color: '#55596e' },
            labels: { style: { colors: '#f5f7ff' } },
        },
        yaxis: {
            title: { text: 'Amount (R)', style: { color: '#f5f7ff' } },
            axisBorder: { color: '#55596e', show: true },
            axisTicks: { color: '#55596e', show: true },
            labels: { style: { colors: '#f5f7ff' } },
        },
    };

    new ApexCharts(document.querySelector("#area-chart"), options).render();
}
