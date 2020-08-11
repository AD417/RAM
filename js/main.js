const D = n => new Decimal(n);

let vm = new Vue({
	el: "#app",
	data: {
		version: "0.0.0",
		configData: config_data,
		initData: {
			chromeTabs: D(10),
			totalTabs: D(0),
			totalRAM: D(1000000000),
			producers: [D(0), D(0), D(0), D(0)],
			upgrades: [D(0), D(0), D(0), D(0)],
			rpt: D(1000),
			prestiged: false,
		},
		chromeTabs: D(10),
		totalTabs: D(0),
		totalRAM: D(1000000000),
		producers: [D(0), D(0), D(0), D(0)],
		upgrades: [D(0), D(0), D(0), D(0)],
		rpt: D(1000),
		tabs: [true, false, false, false],
		state: 0,
		prestiged: false,
	},
	computed: {
		availableRAM: function () {
			return this.totalRAM.sub(this.chromeTabs.mul(this.rpt));
		},
		getSaveObject: function () {
			return {
				version: this.version,
				chromeTabs: this.chromeTabs.toString(),
				totalTabs: this.totalTabs.toString(),
				totalRAM: this.totalRAM.toString(),
				producers: JSON.stringify(this.producers.map(e => e.toString())),
				upgrades: JSON.stringify(this.upgrades.map(e => e.toString())),
				rpt: this.rpt.toString(),
				prestiged: this.prestiged,
			};
		},
		tps: function () {
			let inc = D(0);
			for (let i in this.producers)
				if (!isNaN(i))
					inc = inc.add(
						this.producers[i]
							.times(this.configData.producer_production[i])
							.times(D(2).pow(this.upgrades[i]))
							.times(0.05)
					);
			return inc;
		},
	},
	methods: {
		init: function (wipe = false) {
			this.load(this.initData, wipe);
			if (window.outerHeight > window.outerWidth)
				alert(
					"Please turn your device into landscape mode to play this game, otherwise the UI will look weird :p"
				);
			setInterval(this.loop, 50);
			setInterval(this.save, 5000);
		},
		loop: function () {
			this.chromeTabs = this.chromeTabs.add(this.tps);
			this.totalTabs = this.totalTabs.add(this.tps);
		},
		wipe: function () {
			if (true || confirm("Are you sure you want to lose all progress???")) this.init(true);
		},
		save: function () {
			let save = btoa(JSON.stringify(this.getSaveObject));
			localStorage.setItem("ram_save_file", save);
		},
		load: function (save, ignoreLS = false) {
			let t = localStorage.getItem("ram_save_file");
			try {
				if (t && !ignoreLS) {
					save = t;
					save = JSON.parse(atob(save));
					save.producers = JSON.parse(save.producers) || this.initData.producers;
					save.upgrades = JSON.parse(save.upgrades) || this.initData.upgrades;
				}
			} catch (e) {}
			this.chromeTabs = D(save.chromeTabs);
			this.totalTabs = D(save.totalTabs);
			this.totalRAM = D(save.totalRAM);
			this.rpt = D(save.rpt);
			this.prestiged = save.prestiged;

			let a = save.producers.map(e => D(e));
			for (let i in a) {
				Vue.set(this.producers, i, a[i]);
			}
			let b = save.upgrades.map(e => D(e));
			for (let i in b) {
				Vue.set(this.upgrades, i, b[i]);
			}

			this.save();
		},
		selectTab: function (n) {
			this.tabs.fill(false);
			this.tabs[n] = true;
		},
		f: function (n, type = "standard") {
			return f(n, type);
		},
		prestige: function (layer) {
			this.prestiged = true;
			this.chromeTabs = D(10);
			this.producers = [D(0), D(0), D(0), D(0)];
			this.upgrades = [D(0), D(0), D(0), D(0)];
		},
	},
});
