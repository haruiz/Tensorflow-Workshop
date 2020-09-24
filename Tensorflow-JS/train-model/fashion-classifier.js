import { FMnistData } from './fashion-data.js';

export default class FMnistClassifier {
    constructor() {
        this.model = tf.sequential();
        this.model.add(tf.layers.conv2d({ inputShape: [28, 28, 1], kernelSize: 3, filters: 16, activation: 'relu'}))
        this.model.add(tf.layers.maxPooling2d({ poolSize: [2, 2]})) 
        this.model.add(tf.layers.conv2d({ kernelSize: 3, filters: 64, activation: 'relu'}))
        this.model.add(tf.layers.maxPooling2d({ poolSize: [2, 2]}))  
        this.model.add(tf.layers.flatten()) 
        this.model.add(tf.layers.dense({ units: 128, activation: 'relu' }))
        this.model.add(tf.layers.dense({ units: 10, activation: 'softmax'}))
        this.model.compile({ optimizer: tf.train.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
        //tfvis.show.modelSummary({name: 'Model Architecture'}, this.model);
    }
    async train(epochs= 20) {

        //load dataset
        const dataset = new FMnistData();
        await dataset.load();        
        const BATCH_SIZE = 512;
        const TRAIN_DATA_SIZE = 6000;
        const TEST_DATA_SIZE = 1000;
        const [trainXs, trainYs] = tf.tidy(() => {
            const d = dataset.nextTrainBatch(TRAIN_DATA_SIZE);
            return [
                d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
                d.labels
            ];
        });

        const [testXs, testYs] = tf.tidy(() => {
            const d = dataset.nextTestBatch(TEST_DATA_SIZE);
            return [
                d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
                d.labels
            ];
        });

        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = { name: 'Model Training', styles: { height: '640px' } };
        const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);        

        await this.model.fit(trainXs, trainYs, {
            batchSize: BATCH_SIZE,
            validationData: [testXs, testYs],
            epochs: epochs,
            shuffle: true,
            callbacks: fitCallbacks
        });
        alert("Training is done!");
    }
    predict(tensor) {
        var prediction = this.model.predict(tensor);
        var pIndex = tf.argMax(prediction, 1).dataSync();                
        var classNames = ["T-shirt/top", "Trouser", "Pullover", 
                      "Dress", "Coat", "Sandal", "Shirt",
                      "Sneaker",  "Bag", "Ankle boot"];
        alert(classNames[pIndex]);
    }

    async download(){
        await this.model.save('downloads://my_model');
        alert("Download is done!");
    }
}