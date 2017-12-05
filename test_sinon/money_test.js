QUnit.module("money", {
//	setup:function(assert){alert("setup money individual QUnit.test");},
//	teardown:function(assert){alert("teardown money individual QUnit.test");}
});

QUnit.test("test construct money", function (assert) {
        assert.expect(4);
        var m = new money(1, "EUR");
        assert.ok(m.v == 1, "valeur = 1");
        assert.equal(m.curr, "EUR", "currency = EUR");
        assert.throws(function () {
                var m = new money(-1, "EUR");
            },
            NegativeValueIntroduced(-1),
            "Devises Incompatibles");
        assert.throws(function () {
                var m = new money(1, "DINAR");
            },
            IncorrectCurrencySizeExc("DINAR",5),
            "Currency size too long");
    }
);

QUnit.test("test accesseurs", function (assert) {
        assert.expect(2);
        var m = new money(1, "EUR");
        assert.ok(m.getValue() == 1, "valeur = 1");
        assert.equal(m.getCurrency(), "EUR", "currency = EUR");
    }
);


QUnit.test("test equals", function (assert) {
        assert.expect(4);

        var m1eur = new money(1, "eur");
        sinon.stub(m1eur, "getValue").returns(1);
        sinon.stub(m1eur, "getCurrency").returns("EUR");

        var m1EUR = sinon.stub(new money(1, "EUR"));
        m1EUR.getValue.returns(1);
        m1EUR.getCurrency.returns("EUR");

        var m1CHF = sinon.stub(new money());
        m1CHF.getValue.returns(1);
        m1CHF.getCurrency.returns("CHF");

        var m10eur = sinon.createStubInstance(money);
        m10eur.getValue.returns(10);
        m10eur.getCurrency.returns("EUR");

        assert.ok(m1eur.equals(m1eur), "1 EUR égal à 1 EUR");
        assert.ok(m1eur.equals(m1EUR), "1 EUR égal à 1 eur");
        assert.ok(!m1eur.equals(m1CHF), "1 EUR diff de 1 CHF");
        assert.ok(!m1eur.equals(m10eur), "1 EUR diff de 10 eur");
    }
);

QUnit.test("test equals avec sans stub", function (assert) {
    assert.expect(3);

    var m1eur = new money(1, "eur");
    sinon.stub(m1eur, "getValue").returns(1);
    sinon.stub(m1eur, "getCurrency").returns("EUR");

    var m1EUR = sinon.stub(new money(1, "EUR"));
    m1EUR.getValue.returns(1);
    m1EUR.getCurrency.returns("EUR");
    m1EUR.equals.restore();

    assert.ok(m1eur.equals(m1EUR), "1 EUR égal à 1 EUR");
    assert.ok(m1EUR.equals(m1eur), "1 EUR égal à 1 eur");

    m1EUR.getValue.restore();
    m1EUR.getCurrency.restore();
    m1EUR.toString.restore();

    m1eur.getCurrency.restore();
    m1eur.getValue.restore();

    assert.deepEqual(m1eur, m1EUR);
});

QUnit.test("spy getValue / getCurrency", function (assert) {
    assert.expect(4);

    var m1eur = new money(1, "eur");
    var m1EUR = new money(1, "EUR");

    m1eur_gv = sinon.spy(m1eur, "getValue");
    m1eur_gc = sinon.spy(m1eur, "getCurrency");
    m1EUR_gv = sinon.spy(m1EUR, "getValue");
    m1EUR_gc = sinon.spy(m1EUR, "getCurrency");

    m1eur.equals(m1EUR);

    assert.ok(m1eur_gv.calledOnce); //sinon.assert.calledOnce(m1eur_gv);
    assert.ok(m1eur_gc.calledOnce); //sinon.assert.calledOnce(m1eur_gc);

    assert.ok(m1EUR_gv.calledOnce); //sinon.assert.calledOnce(m1EUR_gv);
    assert.ok(m1EUR_gc.calledOnce); //sinon.assert.calledOnce(m1EUR_gc);

});


QUnit.test("test money factory", function (assert) {
        var factory = new MoneyFactory();
        assert.expect(4);
        var m1EUR = factory.createMoney(1, "EUR");
        var m1eur = factory.createMoney(1, "eur");
        var m1CHF = factory.createMoney(1, "CHF");
        var m10eur = factory.createMoney(10, "eur");
        assert.ok(m1EUR.equals(m1EUR), "1 EUR égal à 1 EUR");
        assert.ok(m1EUR.equals(m1eur), "1 EUR égal à 1 eur");
        assert.ok(!m1EUR.equals(m1CHF), "1 EUR diff de 1 CHF");
        assert.ok(!m1EUR.equals(m10eur), "1 EUR diff de 10 eur");
    }
);


QUnit.test("test money factory fail", function (assert) {
        var factory = new MoneyFactory();
        assert.throws(function () {
            var m1EUR = factory.createMoney(1, "DZD");
        }, UnexistingCurrencyException, "Unknown currency");
    }
);
